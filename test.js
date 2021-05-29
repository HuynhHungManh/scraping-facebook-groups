const puppeteer = require('puppeteer');
const readline = require('readline');
// Thay FB_EMAIL bằng email hoặc tên đăng nhập của ban nhé
var username="100042314643691";
//Thay FB_PASSWORD bằng passoword của bạn nhé
var password="ManhHung123@";
const StormDB = require("stormdb");

(async()=>{

// 	let img = "https\3a //scontent-hkt1-2.xx.fbcdn.net/v/t1.6435-0/cp0/e15/q65/s350x350/186122778_4126255657437286_638438316516625864_n.jpg?_nc_cat\3d 104\26 ccb\3d 1-3\26 _nc_sid\3d ca434c\26 efg\3d eyJpIjoidCJ9\26 _nc_ohc\3d mjUF8UZDaoYAX8Kw46x\26 _nc_ht\3d scontent-hkt1-2.xx\26 tp\3d 9\26 oh\3d d22c45c2a1bcbe30571732d261c2be1c\26 oe\3d 60D91274";
// console.log(img.replace(/\3a /g, ':').replace(/\3d /g, '=').replaceAll('\26 ', '&'));
// Use JSON file for storage
// start db with "./db.stormdb" storage location
const engine = new StormDB.localFileEngine("./db.stormdb");
const db = new StormDB(engine);

// set default db value if db is empty
db.default({ users: [] });

// add new users entry
db.get("users").push({ name: "tom" });

// update username of first user
db.get("users")
  .get(0)
  .get("name")
  .set("jeff");

// save changes to db
db.save();
// // Chạy browser với chế độ headless:false, tức là có giao diện
// const browser=await puppeteer.launch({headless:false});
//
// const page=await browser.newPage();
// // Truy cập vào trang m.facebook.com
// await page.goto('https://www.spreadshirt.com/shop/poodle/');
//
// var images = await page.evaluate(() => {
// 	 let image = document.querySelectorAll(".article__img");
//
// 		let arr_images = [];
// 		// let title = document.querySelectorAll(".label.articleName");
// 		image.forEach((item, index) => {
// 			let src = item.getAttribute('src').trim();
// 			console.log(item);
// 			let src_replace = src;
// 			// if (src.indexOf("compositions")>-1||src.indexOf("products")>-1) {
// 				// src = src.replace('//image.spreadshirtmedia','www.spreadshirt').replace('products','compositions').replace('mp/','').replace('.jpg','.png').replace(',modelId=121,crop=design','').replace("width=378","width=1200").replace("height=378","height=1200");
// 				// src_replace = src.replace(src.slice(src.indexOf("backgroundColor")+15, src.indexOf("backgroundColor")+22)+"",'=none,noPt=true');
// 				// if (src_replace.indexOf('.jpg') == -1) {
// 					arr_images.push({
// 		      	src: item.getAttribute('src').trim(),
// 			      src_replace: src_replace,
// 			      describe : item.getAttribute('alt'),
// 			      path_image : item.getAttribute('alt').toLowerCase().replace(/[^a-zA-Z ]/g, '').replace(/ - /g, ' ').replace(/  /g, ' ').replace(/ /g, ' ').toUpperCase() + '.png',
// 			      id : item.getAttribute('id').trim(),
// 			      // title : title[index].textContent
// 				  });
// 				// }
// 			// }
// 		});
//
//     return image;
//   });

})();

function extractData(data, startStr, endStr) {
  let startIndex, endIndex, text = '';
  startIndex = data.indexOf(startStr);
  if (startIndex != -1) {
      startIndex += startStr.length;
      text = data.substring(startIndex);
      if (endStr) {
          endIndex = text.indexOf(endStr);
          if (endIndex != -1) {
              text = text.substring(0, endIndex);
          } else {
              text = '';
          }
      }
  }
  return text;
}
