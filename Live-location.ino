//Arduino sketch to send the live location from the gps and gsm module to the thinkspeak database.
#include <SoftwareSerial.h>
SoftwareSerial gprsSerial(2,3);
 
#include <String.h>
#include <TinyGPS++.h>

static const int RXPin = 5, TXPin = 4;
static const uint32_t GPSBaud = 9600;

// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial GPS(RXPin, TXPin);

float latitude;
float longitude;

 
void setup()
{
  gprsSerial.begin(9600);    // the GPRS baud rate   
  //  Serial.begin(9600);    // the GPRS baud rate 
  GPS.begin(GPSBaud);
  //  latitude = gps.location.lat();
  //  longitude = gps.location.lng();
  //  Serial.println("Starting....");
  //  Serial.println("Wait for initializing.");
  delay(30000);
}
 
void loop()
{
  latitude = gps.location.lat();
  longitude = gps.location.lng();
  delay(100);   
     
  //  Serial.print("Longitude = ");
  //  Serial.print(longitude);
  //  Serial.println(".");
  //  Serial.print("Latitude = ");
  //  Serial.print(latitude);
  //  Serial.println(".");   
  //  if (gprsSerial.available())
  //  Serial.write(gprsSerial.read());
 
  gprsSerial.println("AT");
  delay(500);
 
  gprsSerial.println("AT+CPIN?");
  delay(500);
 
  gprsSerial.println("AT+CREG?");
  delay(500);
 
  gprsSerial.println("AT+CGATT?");
  delay(500);
 
  gprsSerial.println("AT+CIPSHUT");
  delay(500);
 
  gprsSerial.println("AT+CIPSTATUS");
  delay(500);
 
  gprsSerial.println("AT+CIPMUX=0");
  delay(500);
 
  //  ShowSerialData();
 
  gprsSerial.println("AT+CSTT=\"airtelgprs.com\"");//start task and setting the APN,
  delay(1000);
 
  //  ShowSerialData();
 
  gprsSerial.println("AT+CIICR");//bring up wireless connection
  delay(1000);
 
  //  ShowSerialData();
 
  gprsSerial.println("AT+CIFSR");//get local IP adress
  delay(1000);
 
  //  ShowSerialData();
 
  gprsSerial.println("AT+CIPSPRT=0");
  delay(2000);
 
  //  ShowSerialData();
  
  gprsSerial.println("AT+CIPSTART=\"TCP\",\"api.thingspeak.com\",\"80\"");//start up the connection
  delay(4000);
 
  //  ShowSerialData();
 
  gprsSerial.println("AT+CIPSEND");//begin send data to remote server
  delay(4000);
  //  ShowSerialData();
  
  String str="GET https://api.thingspeak.com/update?api_key=AGSGWOJIMMP0HHQJ&field1=" + String(latitude) +"&field2="+String(longitude);
  Serial.println(str);
  gprsSerial.println(str);//begin send data to remote server
  
  delay(2000);
  //  ShowSerialData();
 
  gprsSerial.println((char)26);//sending
  delay(1000);//waitting for reply, important! the time is base on the condition of internet 
  gprsSerial.println();
 
  //  ShowSerialData();
  
  //  gprsSerial.println("AT+CIPSHUT");//close the connection
  //  delay(1000);
  //  ShowSerialData();
} 

//void ShowSerialData()
//{
//  while(gprsSerial.available()!=0)
//  Serial.write(gprsSerial.read());
//  delay(5000); 
//  
//} 
