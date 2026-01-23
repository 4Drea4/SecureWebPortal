const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try{
                //Github email
                const email =
                profile.emails && profile.emails. length > 0 ? profile.emails[0].value : null;
            //existing users
            let user = await User.findOne({
                $or: [{githubId: profile.id}, {email}],
            });
            //create if doesnt exist
            if (!user) {
                user =await User.create({
                    username: profile.username,
                    email,
                    githubId: profile.id,
                });
            } else {
                //so if my user exists  but doesnt have a github id yet this will give them one
                if (!user.githubId) {
                    user.githubId = profile.id;
                    await user.save();
                }
            }
            return done(null,user);
        }catch (error) {
            return done (error,null)
        }
            }
        
    )
)