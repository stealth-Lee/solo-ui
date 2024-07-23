import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";

export interface JobReq {
  jobId: number;
  name: string;
  handlerName: string;
  handlerParams: string;
  cron: string;
  retryCount: number;
  retryInterval: number;
  policy: number;
  concurrent: boolean;
  status: boolean;
  remark: string;
}

// 新增定时任务
export const creating = (data: JobReq) => {
  return http.post(baseUrlApi("/quartz/job"), { data });
};

// 删除定时任务
export const deleting = (jobIds: number) => {
  return http.delete(baseUrlApi("/quartz/job/" + jobIds));
};

// 修改定时任务
export const updating = (data: JobReq) => {
  return http.put(baseUrlApi("/quartz/job"), { data });
};

// 获取单条定时任务信息
export const getting = (jobId: number) => {
  return http.get<JobReq>(baseUrlApi("/quartz/job/" + jobId));
};

// 获取定时任务信息分页列表
export const paging = (params?: object) => {
  return http.get<JobReq>(baseUrlApi("/quartz/job/page"), { params });
};
