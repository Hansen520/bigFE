/* eslint-disable no-unused-vars */
const getParams = (url, key) => {
  //构造一个含有目标参数的正则表达式对象
  let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  //匹配目标参数
  let link = new URL(url)
  let r = link.search.substr(1).match(reg);
  //返回参数值
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
}

const getParamsMethod1 = (url, key) => {
  let link = new URL(url);
  let searchParams = new URLSearchParams(link.search);
  return searchParams.get(key)
}

const getParamsMethod2 = (url, name) => {
  if (!url) url = location.href;
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  return results == null ? null : results[1];
}

export {
  getParams
}
