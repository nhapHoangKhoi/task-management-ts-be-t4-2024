import { Request, Response } from "express";
import TaskModel from "../../models/task.model";
import UserModel from "../../models/user.model";

// ----------------[]------------------- //
// [GET] /tasks/
export const index = async (request: Request, response: Response) => 
{
   const taskFind = {
      // ----- Get tasks belong to specific suer ----- //
      $or: [
         { createdBy: request["accountUser"].id },
         { listParticipants: request["accountUser"].id }
      ],
      // ----- End get tasks belong to specific suer ----- //
      deleted: false
   };

   // ----- Filter by status ----- //
   if(request.query.status) {
      taskFind["status"] = request.query.status
   }
   // ----- End filter by status ----- //


   // ----- Sort ----- //
   const taskSortBy = {
      // position: "desc",
      // price: "desc",
      // title: "asc"
   };

   const sortKey = `${request.query.sortKey}`;
   const sortValue = request.query.sortValue;

   if(sortKey && sortValue) {
      taskSortBy[sortKey] = sortValue;
   }
   // ----- End sort ----- //


   // ----- Search products (co ban) ----- //
   if(request.query.keyword) {
      const regex = new RegExp(`${request.query.keyword}`, "i");
      taskFind["title"] = regex;
   }
   // ----- End search products (co ban) ----- //


   // ----- Pagination ----- //
   let currentPage: number = 1;
   if(request.query.page) {
      currentPage = parseInt(`${request.query.page}`);
   }

   let itemsLimited: number = 2;
   if(request.query.itemsLimited) {
      itemsLimited = parseInt(`${request.query.itemsLimited}`);
   }

   const startIndex = (currentPage - 1) * itemsLimited;
   // ----- End pagination ----- //


   const listTasks = await TaskModel
      .find(taskFind)
      .limit(itemsLimited)
      .skip(startIndex)
      .sort(taskSortBy);

   response.json(listTasks);
}

// [GET] /tasks/detail/:id
export const getDetailTask = async (request: Request, response: Response) => 
{
   // di tim ban ghi theo id, cu quang vo try catch
   try {
      const id: string = request.params.id;

      const listTasks = await TaskModel.findOne(
         {
            _id : id,
            deleted: false
         }
      );

      response.json(
         {
            code: 200,
            listTasks: listTasks
         }
      );
   }
   catch(error) {
      response.json(
         {
            code: 404,
            message: "Not Found"
         }
      );
   }
}

// [PATCH] /tasks/change-status/:id
// cach 1
export const changeStatus_Cach1 = async (request: Request, response: Response) => 
{
   try {
      const id: string = request.params.id;
      const status: string = request.body.status;

      await TaskModel.updateOne(
         {
            _id: id
         },
         {
            status: status
         }
      );

      response.json(
         {
            code: 200,
            message: "Cập nhật dữ liệu thành công!"
         }
      );
   }
   catch(error) {
      response.json(
         {
            code: 404,
            message: "Not Found"
         }
      );
   }
}

// [PATCH] /tasks/change-status
// cach 2 (nen dung)
export const changeStatus = async (request: Request, response: Response) => 
{
   try {
      const listIds: string[] = request.body.ids;
      const status: string = request.body.status;

      await TaskModel.updateMany(
         {
            // cach viet 1 (viet nhu truoc gio o project 1):
            // _id: listIds

            // cach viet 2 (nen viet kieu nay) :
            _id: {
               $in: listIds
            }
         },
         {
            status: status
         }
      );

      response.json(
         {
            code: 200,
            message: "Cập nhật dữ liệu thành công!"
         }
      );
   }
   catch(error) {
      response.json(
         {
            code: 404,
            message: "Not Found"
         }
      );
   }
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [POST] /tasks/create
export const createTask = async (request: Request, response: Response) =>
{
   try {
      // ----- Make sure the data type is correct with the Model : Number, String,... ----- //
      //
      // code in here
      //
      // ----- End make sure the data type is correct with the Model : Number, String,... ----- //
   
      request.body.createdBy = request["accountUser"].id;
   

      // ----- Check if the user that FE sends is real (i.e. exists in the database) ----- // 
      for(const checkRealUserId of request.body.listParticipants) {
         const realUser = await UserModel.findOne(
            {
               _id: checkRealUserId
            }
         );

         if(!realUser) {
            response.json(
               {
                  code: 400,
                  message: "Không tồn tại userID!"
               }
            );
            return; // stop the program immediately
         }
      }
      // ----- End check if the user that FE sends is real (i.e. exists in the database) ----- // 
   

      // ----- Check if the parentId that FE sends is real (i.e. exists in the database) ----- //
      const parentTaskId = request.body.parentId || "";
      
      if(parentTaskId)
      {
         const realParentId = await TaskModel.findOne(
            {
               _id: request.body.parentId
            }
         );
   
         if(!realParentId) {
            response.json(
               {
                  code: 400,
                  message: "Không tồn tại parentID!"
               }
            );
            return; // stop the program immediately
         }
      }
      // ----- End check if the parentId that FE sends is real (i.e. exists in the database) ----- //


      const newTaskModel = new TaskModel(request.body);
      await newTaskModel.save();
   
      response.json(
         {
            code: 200,
            message: "Tạo công việc mới thành công!",
            task: newTaskModel
         }
      );
   }
   catch(error) {
      response.json(
         {
            code: 404,
            message: "Not Found"
         }
      );
   }
}

// [PATCH] /tasks/edit/:id
export const editTask = async (request: Request, response: Response) => 
{
   try {
      const id: string = request.params.id;
      const dataForUpdate = request.body;

      request.body.updatedBy = request["accountUser"].id;

      await TaskModel.updateOne(
         {
            _id: id
         },
         dataForUpdate
      );

      response.json(
         {
            code: 200,
            message: "Cập nhật thành công!"
         }
      );
   }
   catch(error) {
      response.json(
         {
            code: 404,
            message: "Not Found"
         }
      );
   }
}
// ----------------End []------------------- //


// ----------------[]------------------- //
// [PATCH] /tasks/delete
export const deleteSoftTasks = async (request: Request, response: Response) => 
{
   try {
      const listIds: string[] = request.body.ids;

      await TaskModel.updateMany(
         {
            // cach viet 1 (viet nhu truoc gio o project 1):
            // _id: listIds

            // cach viet 2 (nen viet kieu nay) :
            _id: {
               $in: listIds
            }
         },
         {
            deleted: true
         }
      );

      response.json(
         {
            code: 200,
            message: "Xóa công việc thành công!"
         }
      );
   }
   catch(error) {
      response.json(
         {
            code: 404,
            message: "Not Found"
         }
      );
   }
}

// [DELETE] /tasks/delete-permanent
export const deletePermanentTasks = async (request: Request, response: Response) => 
{
   try {
      const listIds: string[] = request.body.ids;

      await TaskModel.deleteMany(
         {
            _id: {
               $in: listIds
            }
         }
      );

      response.json(
         {
            code: 200,
            message: "Xóa công việc thành công!"
         }
      );
   }
   catch(error) {
      response.json(
         {
            code: 404,
            message: "Not Found"
         }
      );
   }
}
// ----------------End []------------------- //