export default function authLogin(req, res, next)
{
   if (req.session.auth)
         next();
   else
      res.redirect('/login.html');
}