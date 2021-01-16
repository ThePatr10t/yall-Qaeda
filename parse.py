fh=open('gpsPositions','r')

#./meta-zKbqDBBmzjRM.json:  "GPSPosition": "33 deg 18' 48.96\" N, 111 deg 33' 55.44\" W"

import random

# https://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png
# http://maps.google.com/mapfiles/kml/paddle/blu-blank-lv.png
# http://maps.google.com/mapfiles/kml/paddle/red-circle-lv.png


from zlib import crc32

def bytes_to_float(b):
	return float(crc32(b) & 0xffffffff) / 2**32

def str_to_float(s, encoding="utf-8"):
	return bytes_to_float(s.encode(encoding))



print '''<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Parler</name>
    <open>1</open>





    <Style id="ys">
      <IconStyle>
<scale>0.2</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/ylw-blank-lv.png</href>
        </Icon>
      </IconStyle>
    </Style>


    <Style id="rs">
      <IconStyle>
<scale>0.6</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/red-circle-lv.png</href>
        </Icon>
      </IconStyle>
      <BalloonStyle>
        <text>$[video]</text>
      </BalloonStyle>
    </Style>



'''


dcCoords = 38.88974791,-77.00883112
margin=0.01

vidURLs = {}
with open('uploaded', 'r') as up:
	uploaded = [l.strip() for l in up.readlines()]
	uploaded = [l for l in uploaded if len(l)]
	for l in uploaded:
		try: k, v = l.split('\t')
		except: continue
		vidURLs[k]=v
		
#print vidURLs



for l in fh.readlines():
	#print l
	l=l.rstrip()
	l=l.replace('./meta-','').replace(':  "GPSPosition": "','\t')
	l=l.replace('\\','').replace('"','').replace(' deg','').replace("'",'')
	key, pos = l.split('\t')
	key = key.replace('.json','')
	lat, lon = pos.split(', ')
	lat = lat.split(' ')
	latD = float(lat[0]) + float(lat[1])/60.0 + float(lat[2])/3600.0
	if lat[3]=='S': latD*=-1

	lon = lon.split(' ')
	lonD = float(lon[0]) + float(lon[1])/60.0 + float(lon[2])/3600.0
	if lon[3]=='W': lonD*=-1

	if latD < dcCoords[0]-margin : continue
	if latD > dcCoords[0]+margin : continue
	if lonD < dcCoords[1]-margin : continue
	if lonD > dcCoords[1]+margin : continue

	# these use a cryptographic hash function to reproducibly move a point slightly, preventing stacking on the map
	latD += str_to_float(key+'lat')*0.00005
	lonD += str_to_float(key+'lon')*0.00005

	p = '''
      <Placemark>
	<styleUrl>#ys</styleUrl>
        <name>%s</name>
        <Point><coordinates>%s,%s,0</coordinates></Point>
      </Placemark>
	''' % (key, lonD, latD)

	#p=''

	if key in vidURLs:
		url = vidURLs[key]

		if 'youtu.be' in url:
			# <iframe width="420" height="315" src="https://www.youtube.com/embed/A6XUVjK9W4o" frameborder="0" allowfullscreen></iframe>
			# <iframe width="800" height="600" src="https://youtu.be/29_aiqsHO4k" frameborder="0" allowfullscreen>
			url = url.replace('youtu.be','www.youtube.com/embed')
			iframe = '<iframe width="800" height="600" src="%s" frameborder="0" allowfullscreen></iframe>' % url
		elif 'vimeo' in url:
			# https://vimeo.com/499889424
			# https://player.vimeo.com/video/92060045
			url = url.replace('vimeo.com','player.vimeo.com/video')
			iframe = '<iframe src="%s?color=fdeb1d&amp;title=0" width="640" height="360" frameborder="0" allowfullscreen="allowfullscreen"></iframe>' % url

		elif 'daily' in url:
			# https://www.dailymotion.com/video/x7ynacd
			# https://www.dailymotion.com/embed/video/x7tgad0
			url = url.replace('video/', 'embed/video/')
			iframe = '<iframe width="800" height="600" src="%s"></iframe>' % url

		#<value><![CDATA[%s<br><br>]]></value>

		p = '''
	      <Placemark>
		<name>%s</name>
		<styleUrl>#rs</styleUrl>
		<Point><coordinates>%s,%s,0</coordinates></Point>
		<description>%s</description>
	      </Placemark>
		''' % (key, lonD, latD, url)






	#print lat, latD
	#print lon, lonD

	print p


print '''
  </Document>
</kml>

'''
