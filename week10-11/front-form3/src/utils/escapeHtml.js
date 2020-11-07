import faces from '@/assets/js/face'
const htmlEncode = (html) => {
  let temp = document.createElement('div')
  temp.textContent !== undefined ? (temp.textContent = html) : (temp.innerText)
  const output = temp.innerHTML
  temp = null
  return output
}

const escapeHtml = (val = '') => {
  if (!val) return ''
  // 表情转义
  let result = val
  const face = /\sface\[\W{1,}]/g
  if(face.test(result)){
    let group = result.match(face)
    console.log(group)//[" face[怒骂]", " face[失望]", " face[衰]"]
    group.map((item)=>{
      const key = item.match(/\[\S+\]/g)[0]
      console.log(key)// [思考]
      result = result.replace(item, `<img src="${faces[key]}">`)
    })
  }

  // 图片替换
  const img = /img\[\S+\]/g
  if(img.test(result)){
    const group = result.match(img)
    console.log(group)
    group.map((item)=>{
      result = result.replace(item, `<img src="${item.substr(4, item.length - 5)}">`)
    })
  }

  // 链接替换 如: a(链接)[标题]
  const link = /\sa\(\S+\]/g
  if(link.test(result)){
    const group = result.match(link)
    console.log(group)
    const title = /\((.+)\)/
    const linkName = /\[(.+)\]/
    group.map((item)=>{
      const nameGroup = item.match(linkName)
      let name = ''
      if(nameGroup.length > 0){
        name = nameGroup[1]
      }
      const linkGroup = item.match(title)
      let link = ''
      if(linkGroup.length > 0){
        link = linkGroup[1]
      }
      result = result.replace(item, `<a href="${link}">${name}</a>`)
    })
  }


  // 引用替换
  result = result.replace(/\[quote\]/g, '<div class="layui-elem-quote">')
  result = result.replace(/\[\/quote\]/g, '</div>')

  // hr替换
  result = result.replace(/\[hr\]/g, '<hr>')

  // 回车换行的替换
  result = result.replace(/\r\n/g, '<br>')
  result = result.replace(/\n/g, '<br>')

  return result
}

export {
  escapeHtml
}