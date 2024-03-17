import express from "express";
import { dirname } from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import forge from "node-forge";
import mongoose from "mongoose";
import User from "./models.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import list from "./listingmodels.js";
import contact from"./contactmodel.js";
import dotenv from "dotenv";
dotenv.config({ path: './.env' });
var i = 1;
var emails;

var md = forge.md.sha256.create();
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads");
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now());
	},
});
var upload = multer({ storage: storage });
const __dirname = dirname(fileURLToPath(import.meta.url));

const dburl=process.env.dburl;

mongoose
	.connect(dburl)
	.then(() => {
		console.log("connected to db");
	})
	.catch((error) => {
		console.error("Error signing up:", error);
		res.status(500).send("Internal Server Error");
	});

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/product", async (req, res) => {
	try {
		const users = await list.find(); 
		res.render("users.ejs", { users }); // Pass the 'users' data to the 'users.ejs' template
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});
app.get(["/", "/home"], (req, res) => {
    res.sendFile(__dirname + "/home.html");
});
app.get("/about",(req,res)=>{
	res.sendFile(__dirname+"/aboutus.html");
})
app.get("/blog",(req,res)=>{
	res.sendFile(__dirname+"/blog.html");
});
app.post("/product", async (req, res) => {
	try {
		const prod = req.body.prod;
		let users;

		if (prod) {
			users = await list.find({ productname: prod });
		} else {
			users = await list.find();
		}

		res.render("users.ejs", { users });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

app.get("/listingcreation", async (req, res) => {
	res.render("listingcreation.ejs");
});
app.post("/listingcreation", upload.single("image"), async(req, res, next) => {
	
	console.log(i);
	var obj = {
		email: req.body.email,
		productname: req.body.name,
		productaddress: req.body.address,
		productdescription: req.body.description,
		price:req.body.price,
		rating:5,

		productimage: {
			data: fs.readFileSync(
				path.join(__dirname + "/uploads/" + req.file.filename),
			),
			contentType: "image/png",
		},
	};
	list.create(obj);
	if(obj!=null){
	const users = await list.find();
	console.log(users); 
	res.redirect("/product/");
	}
});
app.get("/product/:id", (req, res) => {
	const productid = req.params.id;
	list
		.findById(productid)
		.then((product) => {
			if (product) {
				// If the product is found, render the product showcase page
				res.render("product_showcase.ejs", { product });
			} else {
				// If the product is not found, render an error page or redirect to a different page
				res.status(404).send("Product not found");
			}
		})
		.catch((error) => {
			// Handle errors (e.g., database connection error)
			console.error("Error fetching product data:", error);
			res.status(500).send("Internal Server Error");
		});
});

app.get("/signup", (req, res) => {
	res.render("signup.ejs");
});
app.get("/login", (req, res) => {
	res.render("login.ejs");
});
app.post("/signup", async (req, res) => {
	try {
		const gstin = req.body.gstin;
		if (isValidGSTIN(gstin)) {
			md.update(gstin);
			var gsthash = md.digest().toHex();
			const password = req.body.password;
			if (isValidPassword(password)) {
				const email = req.body.email;
				const username = req.body.uname;
				insert(gsthash, username, email, password);
				res.render("login.ejs");
				
			} else {
				res.render("signup.ejs", { showAlerts: true });
			}
		} else {
			res.render("signup.ejs", { showAlertss: true });
		}
	} catch (error) {
		console.error("Error signing up:", error);
		res.status(500).send("Internal Server Error");
	}
});
app.get("/profile", (req, res) => {
	try {
		User.findOne({ email: emails })
			.exec()
			.then((users) => {
				if (!users) {
					res.redirect("/login");
				}
				list
					.find({ email: emails })
					.exec()
					.then((product) => {
						res.render("profile.ejs", { users, product });
					});
			});
	} catch (error) {
		res.render("login.ejs");
	}
});

app.get('/profile/:id',(req,res)=>{
	const productid = req.params.id;
	list
		.findById(productid)
		.then((product) => {
			if (product) {
				
				res.render("productpage.ejs", { product });
			} else {
				
				res.status(404).send("Product not found");
			}
		})
		.catch((error) => {
			
			console.error("Error fetching product data:", error);
			res.status(500).send("Internal Server Error");
		});
})
app.post('/profile/:id', async (req, res) => {
    const productid = req.params.id;
	const document = await list.findById(productid);
	const email = document.email; 
    console.log('Email found:', email);
	
	const deletedDocument = await list.findByIdAndDelete(productid);
	 if (deletedDocument) {
	 	console.log('Document deleted successfully:', deletedDocument);
		 User.findOne({ email: email })
			.exec()
			.then((users) => {
				if (!users) {
					res.redirect("/login");
				}
				list
					.find({ email: email })
					.exec()
					.then((product) => {
						res.render("profile.ejs", { users, product,showAlert:true});
					});
			});
		
	 } else {
	 	console.log('Document not found or already deleted');
		res.status(404).send('Document not found or already deleted');
	}
        
    
    } 
);


app.post('/profile', async (req, res) => {
    const prod = req.body.prod;
	const logout=req.body.logout;
	
    User.findOne({ email: emails })
        .exec()
        .then((users) => {
            if (!users) {
                res.redirect("/login");
            }
            if (!prod) {
                
                list.find({ email: emails }).exec().then((product) => {
                    res.render("profile.ejs", { users, product });
                });
            } else {
                
                list.find({ email: emails, productname: prod }).exec().then((product) => {
                    res.render("profile.ejs", { users, product });
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            // Handle error appropriately, e.g., display an error page
            res.status(500).send("Internal Server Error");
        });
		if(logout){
			emails=null;
			res.redirect("/login");

		}
});

app.get("/contactus",(req,res)=>{
	res.render("contactus.ejs");
})
app.post("/contactus",(req,res)=>{
	var obj={
		username:req.body.name,
		email:req.body.email,
		message:req.body.message

	};
	contact.create(obj);
	res.render("contactus.ejs",{showAlertss: true});
})

app.post("/login", (req, res) => {
	emails = req.body.email;

	const password = req.body.password;

	User.findOne({ email: emails })
		.exec()
		.then((users) => {
			if (users != null) {
				const b = users.password;

				if (b === password) {
					list
						.find({ email: emails })
						.exec()
						.then((product) => {
							res.redirect("/profile");
						});
				} else {
					res.render("login.ejs", { showAlerts: true });
				}
			}
		})
		.catch((err) => {
			console.error(err);
		});
});
async function insert(a, b, c, d) {
	await User.create({
		gstin: a,
		username: b,
		email: c,
		password: d,
	});
}

function isValidGSTIN(gstin) {
	gstin = gstin.replace(/\s/g, "");

	if (gstin.length !== 15) {
		return false;
	}
	const stateCode = parseInt(gstin.substring(0, 2));
	if (stateCode < 1 || stateCode > 37) {
		return false;
	}
	return true;
}


function isValidPassword(password) {
	const hasUppercase = /[A-Z]/.test(password);

	const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

	const hasMinimumLength = password.length >= 8;

	return hasUppercase && hasSpecialChar && hasMinimumLength;
}

app.listen(port, () => {
	console.log("sui");
});
