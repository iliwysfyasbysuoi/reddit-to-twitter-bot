const table = require('./checker');
const fs = require('fs');
const main = require('./bot');
const downloader = require('./downloader');
const snoowrap = require('snoowrap');
const rwClient = require('./twitterClient');

const Jimp = require('jimp') ;

async function blur() { // Function name is same as of file name
  // Reading Image
  const image = await Jimp.read('./images/x.jpg');
  console.log("* blurify done! ###");
  return image.blur(50).write('./images/x-blur.jpg');

}

async function uploadMedia(b64){
  
  main.T.post('media/upload', { media_data: b64 }, function(
    err,
    data,
    response
  ) {
    let mediaId = data.media_id_string;

    main.T.post('media/metadata/create', { media_id: mediaId }, function(
      err,
      data,
      response
    ) {

      console.log("media ID " + mediaId);
      return mediaId;

    })
  });

  

}

module.exports = {
  tweetImage: async function() {
    let url = await downloader.getImage();
    let b64 = fs.readFileSync('./images/x.jpg', { encoding: 'base64' });

    let blurify = await blur();
    
    // let blurify = await blur();
    let b64_blur = fs.readFileSync('./images/x-blur.jpg', { encoding: 'base64' });
    // let blurred_mediaID = await uploadMedia(b64_blur);
    // console.log("media id blur " +blurred_mediaID);

    console.log('* Uploading image...');

    main.T.post('media/upload', { media_data: b64 }, function(
      err,
      data,
      response
    ) {
      let mediaId = data.media_id_string;

      main.T.post('media/metadata/create', { media_id: mediaId }, function(
        err,
        data,
        response
      ) {
        if (!err) {
          console.log('-> Image uploaded!\r\n*');

          let rawStatus = url[1];

          let noTagStatus = rawStatus.substring(7); // removes [50/50]
          let PollOptions = noTagStatus.split("|"); // splits the choices

          let Option1 = PollOptions[0].trim();
          let Option2 = PollOptions[1].trim();

          let finalStatus = `[50/50] \n ${Option1} \n ${Option2} \n  `;

          console.log('* Uploading BLUR image...');
          main.T.post('media/upload', { media_data: b64_blur }, function(
            err,
            dataBlur,
            response
          ) {
            let blur_mediaId = dataBlur.media_id_string;
      
            main.T.post('media/metadata/create', { media_id: blur_mediaId }, function(
              err,
              dataBlur,
              response
            ) {
              if (!err) {
                console.log('-> Blurred Image uploaded!\r\n* Sending blurred tweet...');

                rwClient.v2.tweet({ text: finalStatus, media: {media_ids: [blur_mediaId]}})
                  .then(BlurredTweet_Data => {
                    /**
                     * id
                     * text
                     */
                    let BlurredTweet_ID = BlurredTweet_Data.data.id;
                    console.log("BlurredTweet_ID" + BlurredTweet_ID);

                    console.log('-> Blurred tweet sent!\r\n* Sending poll tweet...');
                    rwClient.v2.tweet({ text: "Options", 
                                          poll: {
                                            options: [ `${Option1.substring(0,22)}...`, `${Option2.substring(0,22)}...`], 
                                            duration_minutes: 60
                                          },
                                          reply: {
                                            in_reply_to_tweet_id: BlurredTweet_ID
                                          }
                                      }
                    ).then(PollTweet_Data => {

                        let PollTweet_ID = PollTweet_Data.data.id;
                        console.log("BlurredTweet_ID" + PollTweet_ID);
                        
                        console.log("PollTweet_Data" + JSON.stringify(PollTweet_Data));
                        console.log('-> Poll tweet sent!\r\n* Sending original photo tweet...');

                        // rwClient.v2.tweet({ text: "Original Photo [Spoiler]\n\n\n\n\n\n\n\n\n\n", 
                        //                     media: {media_ids: [mediaId]},
                        //                     reply: {
                        //                       in_reply_to_tweet_id: PollTweet_ID
                        //                     }
                        //                   }
                        // ).then(OriginalTweet_Data => {
                            
                        //     console.log("OriginalTweet_Data" + JSON.stringify(OriginalTweet_Data));
                        //     console.log('-> Original Photo tweet sent!\r\n');
                        //     console.log('-> All Tweets in the thread finished.');
                        // });

                        setInterval(main.T.post('statuses/update', {status: "Original Photo [Spoiler].\n.\n.\n.\n.\n.\n.\n.\n.\n.\n", in_reply_to_status_id: PollTweet_ID, media_ids: [mediaId], possibly_sensitive: true}, 
                        function(err, data, response) {
                          console.log("OriginalTweet_Data" + JSON.stringify(data));
                          console.log('-> Original Photo tweet sent!\r\n');
                          console.log('-> All Tweets in the thread finished.');

                        }
                        ),
                        3600000);
                        


                    })
                  })
              }
            })
          })

          

          
          // let paramsV2 = { 
          //   text: finalStatus, 
          //   media: {
          //       media_ids: [blurred_mediaID]
          //     }
          //   };

          //   rwClient.v2.tweet(paramsV2).then(Tweet1_Data => {
              
              
          //      console.log("OKKKKKK" + JSON.stringify(Tweet1_Data));

          //   })

          // rwClient.v2.tweet(paramsV2, function(err, data, response){
          //   if (err) {
          //     console.log(
          //       `-> Error sending tweet!\r\n -> ${new Date().getDate()}/${new Date().getMonth() +
          //         1}/${new Date().getFullYear()},${new Date()
          //         .toLocaleString()
          //         .split(',')
          //         .pop()}\r\n----------------------------------------------------------`
          //     );

          //     process.exit();
          //     return;
          //   }

            

          //   //URLs add table for same check
          //   table.add(url[0]);

          //   console.log(
          //     `-> Tweet sent!\r\n  -> ${new Date().getDate()}/${new Date().getMonth() +
          //       1}/${new Date().getFullYear()},${new Date()
          //       .toLocaleString()
          //       .split(',')
          //       .pop()}\r\n----------------------------------------------------------`
          //   );

          //   console.log("data " + data);

          //   return;
          // });

          // main.T.post('statuses/update', paramsV1, function(err, data, response) {
          //   if (err) {
          //     console.log(
          //       `-> Error sending tweet!\r\n -> ${new Date().getDate()}/${new Date().getMonth() +
          //         1}/${new Date().getFullYear()},${new Date()
          //         .toLocaleString()
          //         .split(',')
          //         .pop()}\r\n----------------------------------------------------------`
          //     );

          //     process.exit();
          //     return;
          //   }

          //   //URLs add table for same check
          //   table.add(url[0]);

          //   console.log(
          //     `-> Tweet sent!\r\n  -> ${new Date().getDate()}/${new Date().getMonth() +
          //       1}/${new Date().getFullYear()},${new Date()
          //       .toLocaleString()
          //       .split(',')
          //       .pop()}\r\n----------------------------------------------------------`
          //   );

          //   return;
          // });



        } else {
          console.log(err);
          console.log('-> Error uploading image!');

          process.exit();
          return;
        }
      });
    });
  }
};
