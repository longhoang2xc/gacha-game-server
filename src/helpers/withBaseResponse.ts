export interface IBaseResponse<T> {
  success: boolean;
  message: string | null;
  messageCode?: string | null;
  errors?: Array<string> | null;
  msgParams?: Array<string> | null;
  code?: number;
  data: T | null;
}

export const withBaseResponse = <T>(objectResponse: IBaseResponse<T>) => {
  return {
    success: objectResponse?.success ?? false,
    message: objectResponse?.message ?? null,
    messageCode: objectResponse?.messageCode ?? null,
    errors: objectResponse?.errors ?? null,
    msgParams: objectResponse?.msgParams ?? null,
    code: objectResponse?.code ?? 0,
    data: objectResponse?.data || null,
  };
};
