class Log {
   constructor(logArray) {
      let rawTime = logArray[0]; // Timestamp
      let dateTime = new Date(rawTime * 1000);
      
      this.time = dateTime.toLocaleString();
      // this.time = this.time.toLocaleDate;
      this.queryType = logArray[1]; // A or AAAA
      this.domainQueried = logArray[2];
      this.originClient = logArray[3];
      let tempStatus = logArray[4]; // 0 Allowed by default, 1 Gravity Blocked, 2 allowed by whitelist, 14 Blocked by custom rule
      this.status = tempStatus == '1' ? 'Gravity Blocked' : tempStatus == '2' ? 'Allowed by whitelist' : tempStatus == '14' ? 'Blocked by custom rule' : 'Allowed by default';
      this.replyCode = logArray[5]; // 0 no error (From DNS)
      let action = logArray[6]; // 2 - forwarded, 3 - cached, 0 - blocked
      this.actionTaken = action == '2' ? 'Forwarded' : action == '3' ? 'Cached' : 'Blocked';
      this.replyTime = logArray[7]; // milliseconds
      this.dnssecStatus = logArray[8]; // N/A - DNSSEC not used
      this.responseCode = logArray[9]; // -1 no further action needed
      this.upstreamServer = logArray[10]; // DNS used on port #
      this.placeholder = logArray[11];
      this.handledBy = logArray[12];
   }

   present() {
      return {
         time: this.time,
         queryType: this.queryType,
         domainQueried: this.domainQueried,
         originClient: this.originClient,
         status: this.status,
         replyCode: this.replyCode,
         actionTaken: this.actionTaken,
         replyTime: this.replyTime,
         dnssecStatus: this.dnssecStatus,
         responseCode: this.responseCode,
         upstreamServer: this.upstreamServer,
         placeholder: this.placeholder
      };
   }

   toString() {
      return JSON.stringify(this.present());
   }
}

export default Log;
