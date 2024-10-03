import { Order_List_API } from '../api/apiConstant';
import { createApiConfig } from '../api/apiHelper';
import type { AxiosRequestConfig } from 'axios';

export const getDashboardOrderList = (): AxiosRequestConfig =>
  createApiConfig(Order_List_API, 'get', undefined, undefined);
