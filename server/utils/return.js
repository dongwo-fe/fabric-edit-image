function returnFail (params = {}) {
  const { code = '200', message = '操作成功', data = null } = params;
  return {
    code,
    message,
    data
  }
}

function returnError (params = {}) {
  const { code = '500', message = '服务异常', data = null } = params;
  return {
    code,
    message,
    data
  }
}

module.exports = {
  returnError,
  returnFail
}
