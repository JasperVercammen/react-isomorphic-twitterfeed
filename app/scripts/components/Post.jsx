import React from 'react';
import DateHelper from './helpers/DateHelper';

if(process.env.BROWSER) {
  // @todo: new webpack configuration??
  // require('./Post.scss');
}

const Post =  (tweet) => {
    return (
        <article className="tweet">
            <div className="tweet-header">
                <span className="tweet-author">
                  <img src={tweet.user.profile_image_url} alt={tweet.user.name} />
                  @{tweet.user.name}
                </span>
                <span className="tweet-date">
                  <DateHelper
                    date={tweet.created_at}
                    format="dd/mm HH:mm:ss"
                  />
                </span>
            </div>
            <div className="tweet-content">{tweet.text}</div>
        </article>
    );
};

export default Post;