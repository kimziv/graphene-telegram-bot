"use strict";
var async = require('async');
var _ = require('underscore');
var _str = require('underscore.string');
var argv = require('yargs').argv;
var lib = require('../lib');
const Itchat = require('../itchat/index');
//var help= require('../lib').cmd.help

var die = function() {
  console.log("bin/gphbot");
  console.log("");
  console.log("USAGE: bin/gphbot.js conf-file.json");
  process.exit(1);
}

if(argv._.length < 1){
  die();
  return;
}

var main = function(){
  var pathConf = argv._[0];
  if(!pathConf.match(/^\//)){
    pathConf = process.cwd() + "/" + pathConf;
  }
  var conf = require(pathConf);

  var cmds = {
    "feed" : lib.cmd.feed,
    "slots" : lib.cmd.slots.show,
    "setslot" : lib.cmd.slots.set,
    "rmslot" : lib.cmd.slots.rm,
    "locations" : lib.cmd.locations.show,
    "setlocation" : lib.cmd.locations.set,
    "rmlocation" : lib.cmd.locations.rm,
    "price" : lib.cmd.price,
    "missed" : lib.cmd.missed,
    "monitor" : lib.cmd.monitor.add,
    "listmonitor" : lib.cmd.monitor.list,
    "stopmonitor" : lib.cmd.monitor.rm,
    "status" : lib.cmd.status,
    "eta" : lib.cmd.eta,
    "help" : lib.cmd.help(conf.cmdPrefix),
  };
  // Prepend prefix
  //cmds = lib.utils.prependCommand(cmds,conf.cmdPrefix);
  console.log("-----"+cmds['!help']);
  // Init modules with state
  lib.utils.mkdirSync(conf.dataDir);
  lib.cmd.monitor.init(conf.dataDir);
  lib.cmd.slots.init(conf.dataDir);
  lib.cmd.locations.init(conf.dataDir);

  var urls = [conf.url];
  if(conf.backupUrls){
    urls = urls.concat(conf.backupUrls);
  }

  var client = null;
  //var exec = lib.backend[conf.backend].exec;

  var checkStatus=function(cmd,client,msg, cb){
        cmd(client,null,null,function(err, s){
              //console.log();
              cb(err,s);
            });
  }

  var callCmd=function(client,cmd,args,chatId,cb){
        cmd(client,args,chatId,function(err, s){
              //console.log();
              cb(err,s);
            });
  }

  // Get client and exec
  lib.wallet.getClient(urls,client,function(err,_client,url){
   // console.log("err",err);
    console.log("URL",url);
    client = _client;

     
    //var back = exec(conf.token,client,cmds);

    // lib.wallet.checkClientAndUpdate(client,urls,back.sendMessage,function(err,_client){
    //   client = _client;
    //   back.setClient(client);
    // });

  var test = new Itchat();
  test.run({debug:true});

  test.on('getMesg', (err, objList, content, from) => {
  err && console.log(err)
  // console.log(test.globalVal)
  var obj=null;
  for (var i = 0; i < objList.length; i++) {
    obj= objList[i]
    if (obj.MsgType === 1) {
      /*
      {"MsgId":"3733066332363459342","FromUserName":"@@90da40cadd14814fc51679c42d2e8040725ab3cf3edcd3f6dcc5d3608df5c24d","ToUserName":"@85356f712c9f3dbc43c1ba1107ee33c0","MsgType":1,"Content":"@97e12051cf40721947778158bc608e0afa0bd8e89453f2101556b616c57e9816:<br/>首仑我赔了不少钱，坑爹","Status":3,"ImgStatus":1,"CreateTime":1495067472,"VoiceLength":0,"PlayLength":0,"FileName":"","FileSize":"","MediaId":"","Url":"","AppMsgType":0,"StatusNotifyCode":0,"StatusNotifyUserName":"","RecommendInfo":{"UserName":"","NickName":"","QQNum":0,"Province":"","City":"","Content":"","Signature":"","Alias":"","Scene":0,"VerifyFlag":0,"AttrStatus":0,"Sex":0,"Ticket":"","OpCode":0},"ForwardFlag":0,"AppInfo":{"AppID":"","Type":0},"HasProductId":0,"Ticket":"","ImgHeight":0,"ImgWidth":0,"SubMsgType":0,"NewMsgId":3733066332363459600,"OriContent":""}
---res:
 witness.yao missed blocks: 3120

      */
     console.log("####getMesg:"+JSON.stringify(obj));
     var content=obj.Content;
     if (content.endsWith('#help')) {
      console.log("<<<<<getMesg:"+content);
     }
      // let obj = JSON.parse(res.text)
      // test.sendMesg({
      //   content: obj.text,
      //   ToUserName: from
      // })
  }
  }
});

    // Monitor procedure
    async.whilst(
      function(){ return true},
      function(cb){

        var cmd = cmds["missed"];
        callCmd(client,cmd,["witness.yao"], null,function(err,s){
          // console.log("---err",err);
          if (!err) {
              console.log("---res:\n",s);
          }else{
              console.log("---err:\n",err);
          }
         
          setTimeout(cb,3000);
        });

        //  var cmd = cmds["feed"];
        // callCmd(client,cmd,["BTC"], null,function(err,s){
        //   // console.log("---err",err);
        //   if (!err) {
        //       console.log("---res:\n",s);
        //   }else{
        //       console.log("---err:\n",err);
        //   }
         
        //   setTimeout(cb,3000);
        // });

        // var cmd = cmds["price"];
        // callCmd(client,cmd,["CNY"], null,function(err,s){
        //   // console.log("---err",err);
        //   if (!err) {
        //       console.log("---res:\n",s);
        //   }else{
        //       console.log("---err:\n",err);
        //   }
         
        //   setTimeout(cb,3000);
        // });

        // checkStatus(cmd,client,"price",function(err,s){
        //   // console.log("---err",err);
        //  //console.log("---res",s);
        //   setTimeout(cb,3000);
        // });
   //     lib.cmd.monitor.notify(client,back.sendMessage,function(e){
	  // if(e){
	  //   console.log(e);
	  // }
   //        setTimeout(cb,1000);
   //      });
      },function(err){
         console.log(err);
      });
  });

};

if(!module.parent){
  main();
}
