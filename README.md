# ReadIT

## Brief Overview
ReadIT is a forum for anything I.T. Built using React, Firebase (Realtime database, Storage) and Chakra UI, currently hosted locally.

## Setup
As ReadIT is currently not hosted online, you cannot access it purely from the web and you will need to set it up locally. To do that:
1. Clone the repository on your machine
2. Type in the console (make sure you’re in the right folder): `npm install`
3. Type in the console: `npm run dev`

Even though it’s setup locally as ReadIT is using Firebase’s Realtime database, no matter from which machine you access the app, the data will be the same and your accounts, posts, comments etc. will be updated globally.

## Database Structure
```json
{
  "posts": {
    "postID": {
      "author": "string",
      "comments": {
        "commentId": {
          "comment": "string",
          "createdOn": "number",
          "userHandle": "string"
        }
      },
      "content": "string",
      "createdOn": "number",
      "likedBy": {
        "userHandle": "Boolean"
      },
      "tags": [
        "tag1",
        "tag2"
      ],
      "title": "string"
    }
  },
  "users": {
    "handle": {
      "createdOn": "number",
      "email": "string",
      "firstName": "string",
      "handle": "string",
      "lastName": "string",
      "likedPosts": {
        "postId": "boolean"
      },
      "uid": "string"
    }
  }
}
