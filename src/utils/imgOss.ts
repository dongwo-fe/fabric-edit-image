/**
 * 图片上传公共方法
 */
import { IMGOSSQF } from '@dm/img_oss';
import { CreateOpsWebApp } from '../api/fetch';

const request = CreateOpsWebApp();
const UploadWithQF = new IMGOSSQF(request, 'juranapp-test', 'easyhome-web');

const IMGCLIENT = {
  upload: async (file: any) => {
    try {
      const IMGCLIENT = await UploadWithQF.getInstance();
      return await IMGCLIENT.upload(file);
    } catch (error) {
      return null
      // let showtxt = '';
      // if (error.code === 0) {
      //   showtxt = error.message;
      // }
      // message.warning(showtxt || '上传失败，请重新上传');
    }
  },
};

export default IMGCLIENT;
