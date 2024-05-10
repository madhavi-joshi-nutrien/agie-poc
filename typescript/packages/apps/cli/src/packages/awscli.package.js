"use strict";
/*
 *    Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *    with the License. A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *    or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *    OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *    and limitations under the License.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsCliPackage = void 0;
var shell_js_1 = require("../utils/shell.js");
var base_package_js_1 = require("./base.package.js");
var isSilentStr = process.env.SILENT_COMMAND_EXECUTION;
var isSilent = isSilentStr ? isSilentStr === 'true' : true;
var AwsCliPackage = /** @class */ (function (_super) {
    __extends(AwsCliPackage, _super);
    function AwsCliPackage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AwsCliPackage.prototype.getLinuxTasks = function () {
        var _this = this;
        return [
            {
                title: 'Installing AWS CLI',
                task: function () { return __awaiter(_this, void 0, void 0, function () {
                    var error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 6]);
                                return [4 /*yield*/, (0, shell_js_1.execAsync)('aws --version | grep -q "aws-cli/2."', { silent: isSilent })];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 6];
                            case 2:
                                error_1 = _a.sent();
                                return [4 /*yield*/, (0, shell_js_1.execAsync)('curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"', { silent: isSilent })];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, (0, shell_js_1.execAsync)('unzip -o awscliv2.zip', { silent: isSilent })];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, (0, shell_js_1.execAsync)('sudo ./aws/install --update', { silent: isSilent })];
                            case 5:
                                _a.sent();
                                return [3 /*break*/, 6];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); },
            },
        ];
    };
    AwsCliPackage.prototype.getMacTasks = function () {
        var _this = this;
        return [
            {
                title: 'Installing AWS CLI',
                task: function () { return __awaiter(_this, void 0, void 0, function () {
                    var error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 5]);
                                return [4 /*yield*/, (0, shell_js_1.execAsync)('aws --version | grep -q "aws-cli/2."', { silent: isSilent })];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 2:
                                error_2 = _a.sent();
                                return [4 /*yield*/, (0, shell_js_1.execAsync)('curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"', { silent: isSilent })];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, (0, shell_js_1.execAsync)('installer -pkg ./AWSCLIV2.pkg -target /', { silent: false })];
                            case 4:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); },
            },
        ];
    };
    AwsCliPackage.prototype.getWindowsTasks = function () {
        var _this = this;
        this.logger.log('AWS CLI in Windows cannot be installed through command line');
        return [
            {
                title: 'Installing AWS CLI',
                skip: function () { return true; },
                task: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/];
                }); }); },
            },
        ];
    };
    return AwsCliPackage;
}(base_package_js_1.BasePackage));
exports.AwsCliPackage = AwsCliPackage;
