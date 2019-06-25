/**
 * A class for initializing feed inputs.
 */
class FeedData {
  constructor(feed='', extracts=[]) {
    this.feed = feed;
    this.extracts = extracts;
  }  
}

/**
 * A class for formatting string to HTML.
 * Inherited by child classes to append html tags.
 */
class HTMLFormatter {
  constructor(value) {
    this.value = value;
  }
  append = (startTag, endTag) => {
    return startTag + this.value + endTag;
  }
}

/**
 * A class for formatting entities.
 */
class EntityFormatter extends HTMLFormatter {
  constructor(value){
    super(value);
  }
  
  format = () => {
    const startTag = '<strong>';
    const endTag = '</strong>';
    return this.append(startTag, endTag);
  }
}

/**
 * A class for formatting links.
 */
class LinkFormatter extends HTMLFormatter {
  constructor(value){
    super(value);
  }
  
  format = () => {
    const startTag = `<a href="${this.value}">`;
    const endTag = ' </a>';
    return this.append(startTag, endTag);
  }
}

/**
 * A class for formatting twitter usernames.
 */
class UserNameFormatter extends HTMLFormatter {
  constructor(value){
    let parsedValue = value.slice(1);
    super(parsedValue);
    this.firstChar = value.slice(0,1);  
  }
  
  format = () => {
    const startTag = `${this.firstChar} <a href="http://twitter.com/${this.value}">`;
    const endTag = '</a>';
    return this.append(startTag, endTag);
  }
}

/**
 * A class for getting formatter based on type.
 * New formatter type can be added here.
 */
class GetFormatter {
  constructor(value, type) {
    const ENTITY = "Entity";
    const TWITTER_UNAME = "Twitter username";
    const LINK = "Link";
    switch(type) {
      case ENTITY: {
        return new EntityFormatter(value);
      }
      case TWITTER_UNAME: {
        return new UserNameFormatter(value);
      }
      case LINK: {
        return new LinkFormatter(value);
      }
    }
  }
}
 
/**
 * Main class for parsing string to HTML based on the inputs.
 */
class StringParser {
 /**
  * @constructor
  * @param {string} feed - Feed from module 1.
  * @param {Array} extracts - Extracted data from module 2.
  */
  constructor(feed, extracts) {
    this.feedData = new FeedData(feed, extracts);
  }  
  
  /**
   * Parse the feedData to HTML.
   * @return {string} 
  */
  parse = () => {
    const {
      feed,
      extracts
    } = this.feedData;
    const sortedExtracts = this.sortExtracts(extracts);  
    return this.getFormattedString(sortedExtracts, feed);
  }
  
  sortExtracts = (extracts) => {
    return extracts.sort((first, second) => {
      return first.start - second.start;
    });
  }
  
  /**
   * Format the feedData to HTML using buffer.
   * @param {string} feed - Feed from module 1.
   * @param {Array} sortedExtracts - Sorted based on start position
   * @return {string} 
  */
  getFormattedString = (sortedExtracts, feed) => {
    let endTillnow = 0;
    let formattedBuffer = [];
    
    formattedBuffer = sortedExtracts.reduce((formattedBuffer, extract) => {
      const value = feed.slice(extract.start, extract.end);
      const formattedValue = new GetFormatter(value, extract.type).format();
      formattedBuffer.push(
        feed.slice(endTillnow, extract.start),
        formattedValue
      );
      endTillnow = extract.end;
      return formattedBuffer;
    }, formattedBuffer);
    
    formattedBuffer.push(feed.slice(endTillnow));
    return formattedBuffer.join('');
  }
  
}


const feed = "Obama visited Facebook headquarters: http://bit.ly/xyz @elversatile";
const extracts = [
  {
    start : 14,
    end: 22,
    type: "Entity"
  },
  {
    start : 0,
    end: 5,
    type: "Entity"
  },
  {
    start : 55,
    end: 67,
    type: "Twitter username"
  },
  {
    start : 37,
    end: 54,
    type: "Link"
  }
];


/**
 * Function to test the output.
 * Renders the html if the output and mock data are matched.
 */
const test = () => {
  //Inititalizing string parser with above output data from module 1 and module 2
  let parser = new StringParser(feed, extracts);
  let parsedString = parser.parse();
  console.log(parsedString);
  let expectedOutput = '<strong>Obama</strong> visited <strong>Facebook</strong>' + 
     ' headquarters: <a href="http://bit.ly/xyz">http://bit.ly/xyz </a> @' + 
     ' <a href="http://twitter.com/elversatile">elversatile</a>'
  if(expectedOutput === parsedString) {
    document.write(parsedString);
  }
}

test();
