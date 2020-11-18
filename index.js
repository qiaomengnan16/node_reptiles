const https = require('https')
const http = require('http')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const fs = require('fs')
const path = 'D:\\imgs\\'

function main() {
    let _data = ''
    const req = https.request('https://www.58pic.com/', (res) => {
        res.on('data', (chunk) => {
            _data += iconv.decode(chunk,'gbk')
        });
        res.on('end', () => {
            const $ = cheerio.load(_data)
            $('.slider-list a').each((index, item) => {
                if ($(item).attr('data-url')) {
                    downFile('http:' + $(item).attr('data-url'))
                }
            })
        });
    });
    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });
    req.end();
}


function downFile(url) {
    const imgName = url.substring(url.lastIndexOf('/') + 1)
    let _data = ''
    const options = {
        headers: {
            'Referer': 'https://www.58pic.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36'
        }
    };
    const req = http.request(url,options, (res) => {
        res.setEncoding("binary");
        res.on('data', (chunk) => {
            _data += chunk
        });
        res.on('end', () => {
            fs.writeFile(path + imgName ,_data, "binary", function (err) {
                if(err){
                    console.log(imgName + ' 下载失败');
                }else{
                    console.log(imgName + ' 下载成功');
                }
            })
        });
    });
    req.end()
}


main()
