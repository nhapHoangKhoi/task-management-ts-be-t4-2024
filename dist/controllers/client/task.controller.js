"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermanentTasks = exports.deleteSoftTasks = exports.editTask = exports.createTask = exports.changeStatus = exports.changeStatus_Cach1 = exports.getDetailTask = exports.index = void 0;
const task_model_1 = __importDefault(require("../../models/task.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const index = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const taskFind = {
        $or: [
            { createdBy: request["accountUser"].id },
            { listParticipants: request["accountUser"].id }
        ],
        deleted: false
    };
    if (request.query.status) {
        taskFind["status"] = request.query.status;
    }
    const taskSortBy = {};
    const sortKey = `${request.query.sortKey}`;
    const sortValue = request.query.sortValue;
    if (sortKey && sortValue) {
        taskSortBy[sortKey] = sortValue;
    }
    if (request.query.keyword) {
        const regex = new RegExp(`${request.query.keyword}`, "i");
        taskFind["title"] = regex;
    }
    let currentPage = 1;
    if (request.query.page) {
        currentPage = parseInt(`${request.query.page}`);
    }
    let itemsLimited = 2;
    if (request.query.itemsLimited) {
        itemsLimited = parseInt(`${request.query.itemsLimited}`);
    }
    const startIndex = (currentPage - 1) * itemsLimited;
    const listTasks = yield task_model_1.default
        .find(taskFind)
        .limit(itemsLimited)
        .skip(startIndex)
        .sort(taskSortBy);
    response.json(listTasks);
});
exports.index = index;
const getDetailTask = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = request.params.id;
        const listTasks = yield task_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        response.json({
            code: 200,
            listTasks: listTasks
        });
    }
    catch (error) {
        response.json({
            code: 404,
            message: "Not Found"
        });
    }
});
exports.getDetailTask = getDetailTask;
const changeStatus_Cach1 = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = request.params.id;
        const status = request.body.status;
        yield task_model_1.default.updateOne({
            _id: id
        }, {
            status: status
        });
        response.json({
            code: 200,
            message: "Cập nhật dữ liệu thành công!"
        });
    }
    catch (error) {
        response.json({
            code: 404,
            message: "Not Found"
        });
    }
});
exports.changeStatus_Cach1 = changeStatus_Cach1;
const changeStatus = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listIds = request.body.ids;
        const status = request.body.status;
        yield task_model_1.default.updateMany({
            _id: {
                $in: listIds
            }
        }, {
            status: status
        });
        response.json({
            code: 200,
            message: "Cập nhật dữ liệu thành công!"
        });
    }
    catch (error) {
        response.json({
            code: 404,
            message: "Not Found"
        });
    }
});
exports.changeStatus = changeStatus;
const createTask = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        request.body.createdBy = request["accountUser"].id;
        for (const checkRealUserId of request.body.listParticipants) {
            const realUser = yield user_model_1.default.findOne({
                _id: checkRealUserId
            });
            if (!realUser) {
                response.json({
                    code: 400,
                    message: "Không tồn tại userID!"
                });
                return;
            }
        }
        const parentTaskId = request.body.parentId || "";
        if (parentTaskId) {
            const realParentId = yield task_model_1.default.findOne({
                _id: request.body.parentId
            });
            if (!realParentId) {
                response.json({
                    code: 400,
                    message: "Không tồn tại parentID!"
                });
                return;
            }
        }
        const newTaskModel = new task_model_1.default(request.body);
        yield newTaskModel.save();
        response.json({
            code: 200,
            message: "Tạo công việc mới thành công!",
            task: newTaskModel
        });
    }
    catch (error) {
        response.json({
            code: 404,
            message: "Not Found"
        });
    }
});
exports.createTask = createTask;
const editTask = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = request.params.id;
        const dataForUpdate = request.body;
        request.body.updatedBy = request["accountUser"].id;
        yield task_model_1.default.updateOne({
            _id: id
        }, dataForUpdate);
        response.json({
            code: 200,
            message: "Cập nhật thành công!"
        });
    }
    catch (error) {
        response.json({
            code: 404,
            message: "Not Found"
        });
    }
});
exports.editTask = editTask;
const deleteSoftTasks = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listIds = request.body.ids;
        yield task_model_1.default.updateMany({
            _id: {
                $in: listIds
            }
        }, {
            deleted: true
        });
        response.json({
            code: 200,
            message: "Xóa công việc thành công!"
        });
    }
    catch (error) {
        response.json({
            code: 404,
            message: "Not Found"
        });
    }
});
exports.deleteSoftTasks = deleteSoftTasks;
const deletePermanentTasks = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listIds = request.body.ids;
        yield task_model_1.default.deleteMany({
            _id: {
                $in: listIds
            }
        });
        response.json({
            code: 200,
            message: "Xóa công việc thành công!"
        });
    }
    catch (error) {
        response.json({
            code: 404,
            message: "Not Found"
        });
    }
});
exports.deletePermanentTasks = deletePermanentTasks;
