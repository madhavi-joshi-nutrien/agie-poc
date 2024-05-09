#!/usr/bin/env node
import { getOrThrow, tryGetBooleanContext } from '@arcade/cdk-common';
import * as cdk from 'aws-cdk-lib';
import { App } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EngineStack } from './engine/engine.stack.js';
import { RegionsApiStack } from './regions/regions.stack.js';
import { ResultsStack } from './results/results.stack.js';
import { SchedulerStack } from './scheduler/scheduler.stack.js';
import { SharedInfrastructureStack } from './shared/shared.stack.js';
import { NotificationsStack } from './notifications/notifications.stack.js';
import { verifiedPermissionsPolicyStoreIdParameter } from './shared/verifiedPermissions.construct.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new App();

// mandatory config
const environment = getOrThrow(app, 'environment');
const administratorEmail = getOrThrow(app, 'administratorEmail');
const administratorPhoneNumber = getOrThrow(app, 'administratorPhoneNumber');

// optional requirements? SES related
const cognitoFromEmail = app.node.tryGetContext('cognitoFromEmail') as string;
const cognitoVerifiedDomain = app.node.tryGetContext('cognitoVerifiedDomain') as string;
const cognitoFromName = app.node.tryGetContext('cognitoFromName') as string;
const cognitoReplyToEmail = app.node.tryGetContext('cognitoReplyToEmail') as string;

const concurrencyLimit = parseInt(app.node.tryGetContext('concurrencyLimit') ?? 10);

// optional requirement to remove bucket and objects when it got deleted
const deleteBucket = tryGetBooleanContext(app, 'deleteBucket', false);

// Optional stac server
const stacServerTopicArn = app.node.tryGetContext('stacServerTopicArn') as string;
const stacServerFunctionName = app.node.tryGetContext('stacServerFunctionName') as string;
const stacServerUrl = app.node.tryGetContext('stacServerUrl') as string;

cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

const stackName = (suffix: string) => `arcade-${environment}-${suffix}`;
const stackDescription = (moduleName: string) => `Infrastructure for ARCADE ${moduleName} module`;

const deployPlatform = (callerEnvironment?: { accountId?: string; region?: string }): void => {
	const sharedStack = new SharedInfrastructureStack(app, 'SharedStack', {
		stackName: stackName('shared'),
		description: stackDescription('Shared'),
		environment,
		administratorEmail,
		administratorPhoneNumber,
		deleteBucket,
		userPoolEmail:
			cognitoFromEmail !== undefined
				? {
					fromEmail: cognitoFromEmail,
					fromName: cognitoFromName,
					replyTo: cognitoReplyToEmail,
					sesVerifiedDomain: cognitoVerifiedDomain,
				}
				: undefined,
		env: {
			region: callerEnvironment?.region,
			account: callerEnvironment?.accountId,
		},
	});

	const regionsStack = new RegionsApiStack(app, 'RegionsModule', {
		stackName: stackName('regions'),
		description: stackDescription('Regions'),
		environment,
		policyStoreIdParameter: verifiedPermissionsPolicyStoreIdParameter(environment),
	});
	regionsStack.addDependency(sharedStack);

	const engineStack = new EngineStack(app, 'EngineModule', {
		stackName: stackName('engine'),
		description: stackDescription('Engine'),
		environment,
		vpc: sharedStack.vpc,
		stacServerUrl,
		env: {
			region: callerEnvironment?.region,
			account: callerEnvironment?.accountId,
		},
	});

	engineStack.addDependency(sharedStack);

	const schedulerStack = new SchedulerStack(app, 'SchedulerModule', {
		stackName: stackName('scheduler'),
		description: stackDescription('Scheduler'),
		environment,
		concurrencyLimit
	});

	schedulerStack.addDependency(sharedStack);
	schedulerStack.addDependency(engineStack);
	schedulerStack.addDependency(regionsStack);

	const resultStack = new ResultsStack(app, 'ResultsModule', {
		stackName: stackName('results'),
		description: stackDescription('Results module stack'),
		moduleName: 'results',
		environment,
		env: {
			region: callerEnvironment?.region,
			account: callerEnvironment?.accountId,
		},
		stacServerTopicArn,
		stacServerFunctionName,
	});

	resultStack.addDependency(sharedStack);
	resultStack.addDependency(regionsStack);

	const notificationsStack = new NotificationsStack(app, 'NotificationsModule', {
		stackName: stackName('notifications'),
		description: stackDescription('Notifications'),
		environment,
	});

	notificationsStack.addDependency(sharedStack);
};

const getCallerEnvironment = (): { accountId?: string; region?: string } | undefined => {
	if (!fs.existsSync(`${__dirname}/predeploy.json`)) {
		throw new Error(
			'Pre deployment file does not exist\n' +
			'Make sure you run the cdk using npm script which will run the predeploy script automatically\n' +
			'EXAMPLE\n' +
			'$ npm run cdk deploy -- -e sampleEnvironment'
		);
	}
	const { callerEnvironment } = JSON.parse(fs.readFileSync(`${__dirname}/predeploy.json`, 'utf-8'));
	return callerEnvironment;
};

deployPlatform(getCallerEnvironment());
