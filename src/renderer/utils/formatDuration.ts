
const formatNumber = (n:number) => {
   const num = n.toString();
   return num[1] ? num : '0' + num;
 };
 
 const parseMS = (tS:number) => {
   if (Number.isNaN(tS)) {
     console.error('tS is NaN');
     return {};
   }
   let seconds = tS;
   // let ms = Math.floor((tS % 1000) / 10);
   let second = Math.floor(seconds % 60);
   let minute = Math.floor((seconds % 3600) / 60);
   let hour = Math.floor(seconds / 3600);
   return {
     hour: formatNumber(hour),
     minute: formatNumber(minute),
     second: formatNumber(second),
   //   ms: formatNumber(ms),
   };
 };

 /**
 * 格式化播放时长
 */
const formatDuration = (time:number) => {
   if (time < 0) return time+'';
   const { hour, minute, second } = parseMS(time);
   return `${hour}:${minute}:${second}`;
 };
 
 export default formatDuration;