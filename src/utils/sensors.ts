export const SensorKeys = {
    mjImagine: 'mjImagine', // 生成图片
    mjTaskStatus: 'mjTaskStatus', // 图片状态
    mjChange: 'mjChange', // 变换
    mjTranslator: 'mjTranslator', //翻译
    editImageClick: 'editImageClick', // 编辑图片点击事件
    saveEditImageClick: 'saveEditImageClick', //保存编辑图片
};
// 自定义埋点
export const trackSensors = (key: string, value: any) => {
    window.sensors && window.sensors.track(key, value);
};
// 添加公共属性
export const registerPage = (data: any) => {
    window.sensors && window.sensors.registerPage(data);
};
