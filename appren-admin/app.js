var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var AdminBro = require("admin-bro");
var AdminBroExpress = require("admin-bro-expressjs");
var AdminBroMongoose = require("admin-bro-mongoose");
var Admin = require("./models/admin");
var User = require("./models/users");
var Skill = require("./models/skills");
var Res = require("./models/res");
var Training = require("./models/training");
var Track = require("./models/track");
var Transaction = require("./models/trans");
var Certificate = require("./models/certificate");
var bcrypt = require("bcryptjs");
AdminBro.registerAdapter(AdminBroMongoose);

mongoose
    .connect("mongodb://localhost:27017/appren", {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {})
    .catch(error => {
        console.log(error);
    });

var app = express();

const contentParent = [{
        name: "Operations",
        icon: "fa fa-file-text"
    },
    {
        name: "Apprentice",
        icon: "fa fa-user"
    }
];

const adminBro = new AdminBro({
    resources: [{
            resource: Admin,
            options: {
                parent: contentParent[1],
                properties: {
                    encryptedPassword: {
                        isVisible: false
                    },
                    password: {
                        type: "string",
                        isVisible: {
                            list: false,
                            edit: true,
                            filter: false,
                            show: false
                        }
                    }
                },
                actions: {
                    new: {
                        before: async request => {
                            if (request.payload.password && request.payload.password !== '') {
                                request.payload = {
                                    ...request.payload,
                                    encryptedPassword: await bcrypt.hash(
                                        request.payload.password,
                                        10
                                    ),
                                    password: undefined
                                };
                            }
                            return request;
                        }
                    },
                    delete: {
                        isVisible: false
                    }
                }
            }
        },
        {
            resource: User,
            options: {
                parent: contentParent[1],
                properties: {
                    encryptedPassword: {
                        isVisible: false
                    },
                    password: {
                        type: "string",
                        isVisible: {
                            list: false,
                            edit: true,
                            filter: false,
                            show: false
                        }
                    }
                },
                actions: {
                    new: {
                        before: async request => {
                            if (request.payload.password && request.payload.password !== '') {
                                request.payload = {
                                    ...request.payload,
                                    encryptedPassword: await bcrypt.hash(
                                        request.payload.password,
                                        10
                                    ),
                                    password: undefined
                                };
                            }
                            return request;
                        }
                    }
                }
            }
        },
        {
            resource: Skill,
            options: {
                parent: contentParent[0],
                properties: {
                    desc: {
                        type: "richtext",
                        isVisible: {
                            list: false,
                            edit: true,
                            filter: false,
                            show: false
                        }
                    }
                }
            }
        },
        {
            resource: Res,
            options: {
                parent: contentParent[0]
            }
        },
        {
            resource: Certificate,
            options: {
                parent: contentParent[0]
            }
        },
        {
            resource: Training,
            options: {
                parent: contentParent[0]
            }
        },
        {
            resource: Track,
            options: {
                parent: contentParent[0]
            }
        },
        {
            resource: Transaction,
            options: {
                parent: contentParent[0]
            }
        }
    ],
    rootPath: "/admin",
    branding: {
        companyName: "Kósé",
        softwareBrothers: false
    },
    VersionSettings: {
        admin: false,
        app: "Kósé Admin Dashboard"
    },
    dashboard: {
        handler: async () => {
            return {
                userCount: await User.countDocuments(),
                skillCount: await Skill.countDocuments(),
                resCount: await Res.countDocuments()
            };
        },
        component: AdminBro.bundle("./views/admin/dashboard")
    }
});

// const router = AdminBroExpress.buildRouter(adminBro);
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        const user = await Admin.findOne({
            email
        });
        if (user) {
            const matched = await bcrypt.compare(password, user.encryptedPassword);
            if (matched) {
                return user;
            }
        }
        return false;
    },
    cookiePassword: "some-secret-password-used-to-secure-cookie"
});
app.use(adminBro.options.rootPath, router);
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.engine(
    ".hbs",
    exphbs({
        extname: ".hbs"
    })
);
app.use(
    express.urlencoded({
        extended: false
    })
);
app.set("view engine", ".hbs");
app.get("/", (req, res) => {
    res.redirect("/admin");
});

module.exports = app;