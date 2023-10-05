import request from "./handler";

const background = async (boothId) => {
    const { data } = await request.get(`/settings-default/${boothId}`);
    return data;  
};

const frame = async (boothId) => {
  const { data } = await request.get(`/frame/${boothId}`);
  return data;
};

const color = async () => {
  const { data } = await request.get("/color");
  return data;
};

const voucher = async () => {
  const { data } = await request.get("/voucher");
  return data;
};

const saveInfo = async (form) => {
  const { data } = await request.post("/list-contact", form);
  return data;
};

const uploadImage = async (form) => {
  const { data } = await request.post("/send-image", form);
  return data;
};
//
const createTr = async (params = {}) => {
  const { data } = await request.post("/open/slide", params);

  return data;
};

const checkTr = async (params = {}) => {
  const { data } = await request.post("/check-transaction", params);
  return data;
};

const checkCb = async (params = {}) => {
  if (!params) return;
  const { data } = await request.post("/callback", params);
  return data;
};

const fetchDataPaket = async (boothId) => {
  const { data } = await request.get(`/package/${boothId}`);
  return data;
};

const userTracking = async (params = {}) => {
  const { data } = await request.post(`/analytic`, params);
  return data;
};

export default {
  background,
  frame,
  color,
  voucher,
  saveInfo,
  uploadImage,
  createTr,
  checkTr,
  checkCb,
  fetchDataPaket,
  userTracking,
};
