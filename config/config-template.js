module.exports = {
  app : {
    port : 3000
  },
  account: {
    firmname_1: "",
    firmname_2: "",//optional
    firmname_3: "",//optional
    address_1: "",
    address_2: "",//optional
    address_3: "",//optional
    nip: "",
  },
  db : {
    type : '',
    host : '',
    dbname : '',
    user : '',
    pass : '',
    port : ''
  },
  model: {
    forceSync: true,
  },
  cors : {
    origin : "*"
  },
  logType : "dev"
};