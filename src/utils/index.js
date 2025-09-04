import BigNumber from 'bignumber.js'
import moment from 'moment/moment'

BigNumber.config({
  EXPONENTIAL_AT: [-20, 40],
  groupSeparator: ',',
  groupSize: 3,
})

export const formatNumber = (num, decimal = 1) => {
  const units = [
    { unit: 'B', threshold: 1e9 }, // Billion
    { unit: 'M', threshold: 1e6 }, // Million
    { unit: 'K', threshold: 1e3 }, // Thousand
    { unit: '', threshold: 1 },    // No unit
  ];

  for (const { unit, threshold } of units) {
    if (num >= threshold) {
      const formatted = (num / threshold).toFixed(decimal);
      return `${formatted}${unit}`;
    }
  }

  return num ? num.toString() : '0';
}

export const formatCreateTime = (timestamp, t) => {
  const num = (Date.now() - timestamp) / 1000
  if (num < 60) {
    return t('just_now')
  }
  if (num < 3600) {
    return parseInt(num / 60) + ' ' + t('minutes_ago')
  }
  if (num < 3600 * 24) {
    return parseInt(num / 3600) + ' ' + t('hours_ago')
  }
  return new Date(timestamp).toLocaleString(window.localStorage.getItem('define_lang') || 'en')
}

export const formatAmount = (amount, decimal) => {
  if (amount === undefined) {
    return;
  }
  if (!decimal) {
    return new BigNumber(amount).toFormat()
  }
  return new BigNumber(new BigNumber(amount).div(new BigNumber(10).pow(decimal))).dp(18)
}

export const formatAmountWithDecimal = (amount, decimal = 18, place = 3) => {
  if (amount === undefined) {
    return;
  }
  return new BigNumber(new BigNumber(new BigNumber(amount).div(new BigNumber(10).pow(decimal))).toFixed(6)).toFormat(place, 1)
}

export const weiPlus = (value1, value2) => {
  return new BigNumber(new BigNumber(value1 ? value1 : 0).plus(new BigNumber(value2 ? value2 : 0)).toFixed(6)).toNumber().toString()
}


export const weiDiv = (value1, value2) => {
  if (value1 == 0 || value2 == 0) {
    return 0
  }
  return new BigNumber(new BigNumber(value1).dividedBy(new BigNumber(value2)).toFixed(6)).multipliedBy(100).toString()
};

export const floatMul = (arg1, arg2) => {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

export const abbrTxHash = (value, startLength = 6, endLength = 6) => {
  if (!value) {
    return value
  }
  return value.substr(0, startLength) + '...' + value.substr(-endLength)
}
export const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
export const activityTypeVal = {
  OfferCanceled: 'Offer Canceled',
  Buy: 'Buy',
  List: 'List',
  Offer: 'Offer',
  Transfer: 'Transfer',
  ListCanceled: 'List Canceled',
  Transfer: 'Transfer',
  Sell: 'Sell',
  Mint: 'Mint',
}

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
}

export const calculateTimeLeft = (startTime, endTime) => {
  const start = new Date(startTime * 1000);
  const end = new Date(endTime * 1000);
  const now = new Date();
  let ended = 'Closed at '
  if(start > now) {
    return 'Starts at ' + moment(startTime*1000).format('YYYY-MM-DD HH:mm')
  }
  if (now > end) {
    return ended + moment(endTime*1000).format('YYYY-MM-DD HH:mm')
  }

  const timeLeft = end - now;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

   let show = 'Ends in '
  if (days > 0) {
    if(days > 1){
      return show + days + ' days'
    }
    return show + days + ' day'
  } else if (hours > 0) {
    if(hours > 1) {
      return show + hours + ' hours'
    }
    return show + hours + ' hour'
  } else {
    if(minutes > 1) {
      return show + minutes + ' minutes'
    }
    return show + minutes + ' minute'
  }
};
export const calculateCreatedTime = (createTime) => {
  const created = new Date(createTime * 1000);
  const now = new Date();
  const diff = now - created;
  
  // If future time, calculate remaining time
  if (created > now) {
    const timeLeft = created - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

    let base = 'Upcoming:'
    if (days >= 1) {
      if(days >1 ) {
        return `${base} ${days} days left`;
      }
      return `${base} ${days} day left`;
    }
    if (days < 1) {
      const time = moment(createTime * 1000).format('HH:mm:ss')
      return `${base} ${time}`;
    }

  }


  // If more than 30 days, show date
  // if (diff > 30 * 24 * 60 * 60 * 1000) {
  //   return `Created at ${moment(createTime * 1000).format('YYYY-MM-DD HH:mm')}`
  // }

  // If more than 1 day, show days
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) {
    if(days === 1) {
      return `Created ${days} day ago`;
    }
    return `Created ${days} days ago`;
  }

  // If more than 1 hour, show hours
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours > 0) {
    if(hours === 1) {
      return `Created ${hours} hour ago`;
    }
    return `Created ${hours} hours ago`;
  }

  // If more than 1 minute, show minutes
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes > 0) {
    if(minutes === 1) {
      return `Created ${minutes} minute ago`;
    }
    return `Created ${minutes} minutes ago`;
  }

  // If less than 1 minute, show seconds
  const seconds = Math.floor(diff / 1000);
  return `Created ${seconds} seconds ago`;
};


export const formatAddress = (address,len = 3) => {
  if (!address) return '';
  return `${address.slice(0, len)}...${address.slice(-len)}`;
};

export const getQueryString = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);  // Get the string after '?' in the URL and match it with regex
  var context = "";
  if (r != null)
    context = r[2];
  reg = null;
  r = null;
  return context == null || context == "" || context == "undefined" ? "" : context;
}