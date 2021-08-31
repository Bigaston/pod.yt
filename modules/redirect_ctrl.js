const bdd = require("./bdd").get();
const https = require("https");

module.exports = {
  redirect: (req, res) => {
    if (req.params.code.startsWith("@")) {
      let query = `{
				podcast(identifier:"${req.params.code.replace("@", "").toLowerCase()}") {
					socials {
						youtube
					}
				}
			}`;

      let request = https.request(
        `https://feeds.podcloud.fr/graphql?query=${encodeURI(query)}`,
        (response) => {
          response.on("data", (d) => {
            let result = JSON.parse(d);

            if (result.data.podcast === null) {
              res.redirect("/~404");
            } else {
              if (result.data.podcast.socials.youtube === null) {
                res.redirect("/~404");
              } else {
                res.redirect(
                  "https://youtube.com/" + result.data.podcast.socials.youtube
                );
              }
            }
          });
        }
      );

      request.on("error", (error) => {
        res.redirect("/~404");
      });

      request.end();
    } else {
      if (bdd.link[req.params.code] != undefined) {
        res.redirect(bdd.link[req.params.code].to);
      } else {
        res.redirect("/~404");
      }
    }
  },
};
