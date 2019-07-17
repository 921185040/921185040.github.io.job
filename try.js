const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const other = require('./other')

//自定义一下初始页面
let pagesNow = 1;

//封装一下函数
const outSide = () =>{
    doCraw(pagesNow)
}

const doCraw =async (pageNow)=>{
    //先获取页面对象
    let pageUrl = `https://www.dbmeinv.com/?pager_offset=${pageNow}`;
    const page = await other.getPage(pageUrl)
    //然后获取当前页面图片信息的数组对象
    let pictureList = other.getPictureList(page);
    await downloadPictureList(pictureList);
    //把图片信息json文件存进去
   
}

//用来存储到json文件去的
var pictureMessage = []



//下载当前页面的图片信息
const downloadPictureList =async (list) =>{
    let index = 0 ;//用来后面判断下载结束没有
    var lastpicture ;
    for(let i = 0 ; i < list.length ; i++){
        // await storeMessage(list[i]);
        lastpicture=list[i]
        await downloadPicture(list[i]);//一个一个对象下载
        // console.log(list[i])
        pictureMessage.push(list[i])
        let obj = JSON.stringify(pictureMessage,"","\t")
        fs.writeFile(`./data.json`,obj,function(err){
            if(err){console.log(err)}
        })
        index++;
    }
    //判断这一页下完没有
    if (index === list.length) {
        console.log(`第${pagesNow}页下载完成，共${index}张图片。========================== `)
        if (pagesNow < 5) {
          // 进行下一页的相册爬取1
          doCraw(++pagesNow)
        }
      }
}
//
const storeMessage = async picture =>{

}
//下载照片
var pictureName = 1;//用来给图片排序
const downloadPicture = async picture =>{
    picture.id = pictureName
    await other.downloadPicture(picture,`./picture/${pictureName}.jpg`).then(other.store(pictureName,picture));
    pictureName++;
}

outSide()