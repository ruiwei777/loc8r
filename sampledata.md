After connecting to MongoDB,
1. use `show collections` to list collection names. 

2. use `db.collectionName.find()` to list all data inside the collections. From now on this document will refer `collectionName` to `locations`.

3. use db.locations.save(document) to save a document into the collection `locations`.
The structure of a sample document is the following:

```
{
  "_id" : ObjectId("5815b822fec1957cbe5fcfa4"),
  "name" : "Starcups",
  "address" : "125 High Street, Reading, RG6 1PS",
  "rating" : 3,
  "facilities" : [
    "Hot drinks",
    "Food",
    "Premium wifi"
  ],
  "coords" : [
    -0.9690884,
    51.455041
  ],
  "openingTimes" : [
    {
      "days" : "Monday - Friday",
      "opening" : "7:00am",
      "closing" : "7:00pm",
      "closed" : false
    },
    {
      "days" : "Saturday",
      "opening" : "8:00am",
      "closing" : "5:00pm",
      "closed" : false
    },
    {
      "days" : "Sunday",
      "closed" : true
    }
  ],
  "reviews" : [
    {
      "author" : "Simon Holmes",
      "id" : ObjectId("5815b917fec1957cbe5fcfa5"),
      "rating" : 5,
      "timestamp" : ISODate("2013-07-15T14:00:00Z"),
      "reviewText" : "What a great place. I can't say enough good things about it."
    },
    {
      "author" : "Jack",
      "rating" : 2,
      "reviewText" : "I don't like this place.",
      "_id" : ObjectId("58211fddc8b1fd000fb087d5"),
      "createdOn" : ISODate("2016-11-08T00:44:13.813Z")
    }
  ]
}
```
Note that when saving the document for the first time, you **don't** need to provide the `_id` filed, which will be automatically populated by the database.

The default behavior of `save()` is:
a. when saving a document without `_id` field, it is inserting a new record, and the `_id` field is automatically populated.
b. when saving a document with a `_id` field which has a new value, it is inserting a new record with the specified `_id` value.
c. when saving a document with a `_id` field which has an existing value in the database, it is **updating** an existing document.


```
// to save a sample document
// request lng=0.799, lat=51.37, locations too far away from this won't be displayed
document = {
  "name" : "Grill'ed",
  "address" : "2/3 Chadstone Road, Chadstone, VIC",
  "rating" : 4,
  "facilities" : [
    "Bench",
    "Outdoor Tables",
    "Colorful Baloons"
  ],
  "coords" : [
    -0.801,
    51.2
  ],
  "openingTimes" : [
    {
      "days" : "Monday - Friday",
      "opening" : "8:00am",
      "closing" : "8:00pm",
      "closed" : false
    },
    {
      "days" : "Saturday",
      "opening" : "0:00am",
      "closing" : "23:59pm",
      "closed" : false
    },
    {
      "days" : "Sunday",
      "closed" : true
    }
  ],
  "reviews" : [
    {
      "author" : "Tony Stark",
      "id" : ObjectId("5815b917fec1957cbe5fcfa5"),
      "rating" : 4,
      "timestamp" : ISODate("2017-07-03T14:00:00Z"),
      "reviewText" : "Nice place to spend a weekend."
    },
    {
      "author" : "Peter Parker",
      "rating" : 5,
      "reviewText" : "No comments.",
      "_id" : ObjectId("58211fddc8b1fd000fb087d5"),
      "createdOn" : ISODate("2017-08-02T00:44:13.813Z")
    },
    {
      "author" : "Steve Rogers",
      "rating" : 4,
      "reviewText" : "I like playing baloons here!",
      "_id" : ObjectId("58211fddc8b1fd000fb087c5"),
      "createdOn" : ISODate("2017-08-11T00:44:13.813Z")
    }
  ]
}

db.locations.save(document)

```