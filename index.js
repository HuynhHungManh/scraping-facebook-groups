const puppeteer = require('puppeteer');
const readline = require('readline');
const fs = require("fs");
const mkdirp = require('mkdirp');
const join = require("path");
const StormDB = require("stormdb");

// Thay FB_EMAIL bằng email hoặc tên đăng nhập của ban nhé
var username="100042314643691";
//Thay FB_PASSWORD bằng passoword của bạn nhé
var password="ManhHung123@";

(async () => {
	const engine = new StormDB.localFileEngine("./groups.stormdb");
	const db = new StormDB(engine);
	db.default({ groups: [] });
	// Chạy browser với chế độ headless:false, tức là có giao diện
	const browser=await puppeteer.launch({headless : false});

	const page=await browser.newPage();
	await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36');
	// Truy cập vào trang m.facebook.com
	await page.goto('https://m.facebook.com');

	const cookies = [{"domain":".facebook.com","expirationDate":1685296678.755465,"hostOnly":false,"httpOnly":true,"name":"sb","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"Bn5PX0Xi4afPOUAkN8mlPn0U"},{"domain":".facebook.com","expirationDate":1662117130.0279,"hostOnly":false,"httpOnly":true,"name":"datr","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"Bn5PXzKEarIi1cviueQiHlBL"},{"domain":".facebook.com","expirationDate":1629951457,"hostOnly":false,"httpOnly":false,"name":"_fbp","path":"/","sameSite":"lax","secure":false,"session":false,"storeId":"0","value":"fb.1.1615812123940.808330943"},{"domain":".facebook.com","expirationDate":1622829469,"hostOnly":false,"httpOnly":false,"name":"wd","path":"/","sameSite":"lax","secure":true,"session":false,"storeId":"0","value":"1848x949"},{"domain":".facebook.com","expirationDate":1622829438.035438,"hostOnly":false,"httpOnly":false,"name":"locale","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"vi_VN"},{"domain":".facebook.com","expirationDate":1653760676.755485,"hostOnly":false,"httpOnly":false,"name":"c_user","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"100042314643691"},{"domain":".facebook.com","expirationDate":1653760676.755497,"hostOnly":false,"httpOnly":true,"name":"xs","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"38%3AbmEswUOVgH2fZw%3A2%3A1622224677%3A-1%3A5758"},{"domain":".facebook.com","expirationDate":1630000674.755508,"hostOnly":false,"httpOnly":true,"name":"fr","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"1Fg5oyu7t63dhsGCq.AWX2JOI0nh_G-9HeZVJy8ndEcR4.BgsS0t.Ay.AAA.0.0.BgsS8k.AWV6TGhj5Ao"},{"domain":".facebook.com","expirationDate":1622314683.82626,"hostOnly":false,"httpOnly":true,"name":"spin","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"r.1003877121_b.trunk_t.1622224679_s.1_v.2_"}];

	await page.setCookie(...cookies);
	const cookiesSet = await page.cookies('https://m.facebook.com');

	// Nhập email vào ô đăng nhập
	await	page.type('#m_login_email', username);
	// Nhập password vào ô đăng nhập
	await	page.type('#m_login_password', password);
	// Click nút đăng nhập
	await	page.click("button[value='Đăng nhập']");
	// Đợi trang tải xong
	await	page.waitForNavigation();

	await page.goto('https://m.facebook.com/groups_browse/your_groups');

	var groupsData = await page.evaluate(() => {
	  let titles = document.querySelectorAll(".h3z9dlai.ld7irhx5.pbevjfx6.igjjae4c");
	  let links = document.querySelectorAll("a._7hkg");
		let titlesArr = [];

		titles.forEach((item, index) => {
			titlesArr.push({
	    	title: item.innerHTML,
				group: links[index].getAttribute('href').replace('/groups/', '').replace('/?ref=group_browse', '').trim()
		  });
		})

	  return titlesArr;
	});

	let allGroups = [];

	for (item of groupsData) {
		let data = { group: '', data: [] };
		await page.goto('https://m.facebook.com/groups/' + item.group);

		for (let i = 0; i < 100; i ++) {
			await page.evaluate(_ => {
				window.scrollBy(0, 1000);
			});
		}

		let groupsDetail = await page.evaluate((item) => {
			let details = [];
		  let postIds = document.querySelectorAll("._2ip_._4b44");
			postIds.forEach((itemDetail) => {
				details.push({
		    	postId: itemDetail.getAttribute('id').replace('feedback_inline_', ''),
					group: item.group
			  });
			});
		  return details;
		}, item);

		let postContent = [];
		for (postDetail of groupsDetail) {
			let content = {
				group: postDetail.group,
				postId: postDetail.postId,
				content: ''
			};
			await page.goto('https://m.facebook.com/groups/' + postDetail.group + '/permalink/' + postDetail.postId + '/?ref=group_browse');
			for (let i = 0; i < 100; i ++) {
				await page.evaluate(_ => {
					window.scrollBy(0, 1000);
				});
			}

			let contentHTML = await page.evaluate((item) => {
			  let postIds = document.querySelector("._5rgr async_like");
			  return document.querySelector("._5rgr.async_like").innerHTML;
			}, item);
			content.content = contentHTML;
			postContent.push(content);
			break;
		}
		data.group = item.group;
		data.data = postContent;

		// allGroups.push(data);
		db.get("groups").push(data);
	};

	// if (!fs.existsSync('./groups.txt')) {
	// 	let json = JSON.stringify(allGroups);
	// 	fs.writeFile('./groups.txt' , json, 'utf8', function(err) {
	// 		if (err) {
	// 				console.log('Not create file!');
	// 		} else {
	// 			console.log('Created file group.txt!');
	// 		}
	// 	});
	// }

	// set default db value if db is empty


	// add new users entry
	// db.get("groups").push({ name: "tom" });

	// update username of first user
	// db.get("users")
	//   .get(0)
	//   .get("name")
	//   .set("jeff");

	// save changes to db
	console.log("Done");
	db.save();
})();
