// This #include statement was automatically added by the Particle IDE.
#include <HttpClient.h>

// This #include statement was automatically added by the Particle IDE.
#include "application.h"
#include <HttpClient.h>

int tempPin = A0;
unsigned int nextTime = 0;    // Next time to contact the server
char publishString[60];
int led1 = D0;
int led2 = D7;

HttpClient http;
http_request_t request;
http_response_t response;

// Headers currently need to be set at init, useful for API keys etc.
http_header_t headers[] = {
     { "Content-Type", "application/json" },
    //  { "Accept" , "application/json" },
    // { "Accept" , "*/*"},
    { "Accept" , "*/*"},
    { "User-agent", "Particle HttpClient"},
    { NULL, NULL } // NOTE: Always terminate headers will NULL
};

void setup() {
  Serial.begin(9600);
  request.hostname = "picky-home.herokuapp.com";
  request.port = 80;
  request.path = "/readings";
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
   Particle.function("led",ledToggle);

   digitalWrite(led1, LOW);
}

unsigned long lasttime;
int mesPow,mesPow2;

void loop() {
  static unsigned long tracktime;
  static unsigned long tracktime2;
  if(millis()>tracktime) {
      tracktime = millis()+2000;
      routine();
  }
  if(digitalRead(D1)==LOW) {
      unsigned long thistime = millis();
      if(thistime-lasttime>100) { // Start of the sequence
          mesPow = 0;
          unsigned long tracktime3 = millis();
          int increment = 45;  // first slice
          while(millis()<tracktime3+7*80+30) { // sequence length
            if(millis()>tracktime) {
              tracktime = millis()+2000;
              routine();
            }
            if(millis()>tracktime3+increment) {
                increment+=80;
                bool val = digitalRead(D1);
                mesPow |= val<<increment/80;
            }
          }
          mesPow2 = mesPow;
          Serial.println(mesPow2);
      }
      lasttime = thistime;
  }
}

void routine() {
  int tempReading = analogRead(tempPin);
  float tempVolts = tempReading * 3.3 / 4095.0;
  float tempC = (tempVolts - 0.5) * 100.0;
  float tempF = tempC * 9.0 / 5.0 + 32.0;
  sprintf(publishString, "{\"temp\":%f, \"energy\":%f}", tempF, tempF);
  request.body = publishString;
  http.post(request, response, headers);
//   Serial.println(response.status);
//   Serial.println(request.body);
}

int ledToggle(String command) {
    
    if (command=="on") {
        tone(led1,37900);
        delay(200);
        noTone(led1);
        delay(200);
        tone(led1,37900,20);
        digitalWrite(led2,HIGH);
        return 1;
    }
    else if (command=="off") {
        tone(led1,37900);
        delay(20);
        noTone(led1);
        delay(40);
        tone(led1,37900,20);
        digitalWrite(led2,LOW);
        return 0;
    }
    else {
        return -1;
    }
}