<b>Daryl - Named such because why not.</b>

What we have here is several goodies. 

1.) node based scraping utility<BR>
2.) queue manager for shifting high-volume tasks sanely<BR>
3.) common abstraction for requesting API's with ten examples and Jasmine tests<BR>
4.) public proxy rotator for firing requests through<BR>
5.) mongodb for saving the extracted information<BR><BR>

Putting it all together Daryl is an information research platform.

The idea is scraping event data from pages like do512.com for venue names, entertainers and locations.  Then requesting further attributes from sites such as yelp or additional media from flickr and instagram. With this service tuned and running properly it creates a data profiles for events and venues in the target city. Long-term this data can be used to power a variety of apps or websites. 

<b>running Daryl</b>

node start.js
