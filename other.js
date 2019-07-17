const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
//获取当前页面html
    async  getPage (url) {
        return{
            res:await axios.get(url)
        }
    },
    getPictureList(page){
        let list = [];//用来装界面中的图片对象
        const $ = cheerio.load(page.res.data);//解析html
        $('.thumbnail').each((index,element)=>{
            let domImag = $(element).find("a.link img");
            let picture = {
                id:'',
                words:domImag.attr('alt'),//描述文字
                url:domImag.attr('src'),//图片地址
                desc:''
            }
            // console.log("放进来的东西是不是有问题",picture)
            list.push(picture)
        })
        
        return list;
    },
    async downloadPicture(picture,pictureName){
        
        // console.log(picture.url)
        // console.log("开始下载了哦");
        await axios({
            method:'get',
            url:picture.url,
            responseType:'stream',
            headers:{
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
            }
        }).then(function(res){
            // console.log("回来的啥",res.data)
            res.data.pipe(fs.createWriteStream(pictureName))
        })
    },
    async store(picturenum,picture){
        fs.readFile(`./picture/${picturenum}.jpg`, function(err, data){ 
            picture.desc = data.toString('base64')
        });
        return picture
    }
}

