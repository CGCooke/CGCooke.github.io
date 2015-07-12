---
layout: post
title: Preamble Detection
---

![_config.yml]({{ site.baseurl }}/images/PeambleDetection/header)

> ADS-B Preamble detection

---
Summary
===============

Before we can decode ADS-B message, we first need to detect them. To do this, we need to find the preamble which proceeds each message. 

---


The Preamble
===============

The preamble is a special pattern or sequence of pulses that can be easily detected by a receiver. The RTLSDR code looks does this by looking for a sequence of bits which meet a certain criteria, a more sophisticated approach is to correlate the incoming signal with a template of the preamble. When the preamble is encountered, the correlation will be of a maximal value. The technical term for correlating the incoming signal with a template is 'matched filtering'.

The choice of the threshold used will represent a tradeoff between False negatives and false positives (Type I and Type II errors). 

The preamble is 8 microseconds long, however we can "extend" it by observing that the first 3 fields of the data are unique to each aircraft, and are the same for every message. 

An image of the preamble can be seen here:


![_config.yml]({{site.baseurl}}/images/PreambleDetection/PreambleTemplate.png)

In practice, the preamble template is modified so that the average value is zero. This is to ensure that the average value of the correlation with white gaussian niose is zero. 

The modified preamble template can be seen below:

![_config.yml]({{site.baseurl}}/images/PreambleDetection/WeightedPreambleTemplate.png)

At this point, we turn our attention to the structure of the message. 

The most elegant explanation of the message format can be found [here](http://adsb-decode-guide.readthedocs.org/en/latest/)

All ADS-B messages have the following structure. 

* DF = 5 Bits
* CA = 3 Bits
* ICAO24 = 24 Bits

The rest of the message consist of data, and a 24 bit CRC which can be used to ensure the integrity of the message. 
The total length of the data is 112 bits, transmitted at 1Mhz. 


Regardless of the ICAO24 identifier, every ADS-B message starts with 0x8D.

The raw hex data from an ADS-B receiver can be seen below. 

Note that: 
DF & CA = 0x8D
ICAO24 = 0xA788DB

8DA788DB99919D0E182C2D0982C8
8DA788DB586D65697AE244FD3CCB 
8DA788DB99919C0E18382DD26606
8DA788DBEA1D6860015F88E057E1 
8DA788DB586D51D7D475B01D8EEB 
8DA788DB99919C0E18442D38081D
8DA788DB586D51D7EE75DD3DEE3B 
8DA788DB91918C0E185C2DD8F01D
8DA788DBEA5F6860011F88E857E1
8DA788DBF8630002004EB8B7D480
8DA788DB99919C0E18702C21761D
8DA788DB5A6AE56A2AE383678416

From this we can conclude that a series of ADS-B messages from the same aircraft have been detected. 

---


Extending the preamble
===============

---

By extending the preamble with these extra bits, messages can be more effectively detected, because we are extending the length of the matched filter. 

If we wish to look for an ADS-B message, as opposed to other types of messages transmitted at 1090Mhz, then we can append 0x8D to the preamble. 
Thinking in terms of bits, the preamble is 8us long, so has 8 bits worth of "correlation power". 0x8D represents another 8 bits that is common to all ADS-B messages. 

An example can seen below.
![_config.yml]({{site.baseurl}}/images/PreambleDetection/SignalVsTemplate.png)

![_config.yml]({{site.baseurl}}/images/PreambleDetection/SignalVsTemplate2.png)

If we want to search for a message from a particular aircraft, we can use both 0x8D and the ICAO24 identifier for the aircraft. 

We end up with an extra  
32 bits = 4 Bytes = 8 Hex characters.

The impact of extending the preamble can be seen below. 

Using just the preamble
![_config.yml]({{site.baseurl}}/images/PreambleDetection/8bitpreamble.png)

Using the preamble + 0x8D
![_config.yml]({{site.baseurl}}/images/PreambleDetection/16bitpreamble.png)

Using the preamble + 0x8D + ICAO24
![_config.yml]({{site.baseurl}}/images/PreambleDetection/40bitpreamble.png)

Using the preamble + 0x8D + ICAO24 + The data + CRC
![_config.yml]({{site.baseurl}}/images/PreambleDetection/120bitpreamble.png)

In the final case, all of the bits were used. Obviously, this represents a ceiling in terms of performance. While it initially looks like a somewhat philosophical question 'Why bother trying to detect the message if you already know what it says?', on possibility is attempting to guess as many of the bits in a message as possible, based on the contents of previous messages, and then searching for, and decoding the message. 

