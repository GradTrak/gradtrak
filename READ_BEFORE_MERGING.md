# READ THIS BEFORE YOU MERGE
So you have decided, after much deliberation, that you want to merge a branch. 

Maybe you're daring, and want to merge into _*master*_? Or you just want to 
take it easy and merge into develop? Well, regardless, you're here because you 
want to merge a file. Or two files. Or even three! And that's okay... as long
as you don't break _too_ many things with your merge. Has to be within reason,
of course...

So here you will find a list of everything that we should probably test 
before we actually merge anything. Probably. Go through them and, uh, 
try not to break more than a few if you're merging into prod, okay? 

## So what do I need to check? 

I'm so glad you asked! Here are the basics: 

- Logging in, logging out. 
- Creating an account. Yes, I know you can use a nonexistent email. It's ok.
- Log in with google, change a course, semester, and a goal,
    then log out, and log back in.
- Repeat the above with a normal account
- (if pushing to prod) Create a new account with google. 
- Add a major
- Change a major
- Add a second major
- Add a major and then cancel it by not clicking confirm (this should NOT add it)
- Mark a requirement as manually fulfilled for each of:
    * Count req
    * Unit req
    * Regex req
    * Course req
    * Tag req? We don't really have tag reqs outside of count/units, though
    * The child req of a multi req
    * the parent req of a multi req
    * ALL child req of a multireq (this should complete the multireq)
- Add a semester
- Delete a semester
- Delete all semesters in a single year
- Some gradtrak yellow. Add an engineering course and add 2 upper div HSS to make 
    the whole thing turns sour 
- TODO add your stuff here!
