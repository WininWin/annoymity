#!/usr/bin/env python

"""
 * @file dbFill.py
 * Used in CS498RK FP to populate database with randomly generated users and products.
 *
 * @date Created: Spring 2015
 * @date Modified: Spring 2015
"""

import sys
import getopt
import httplib
import urllib
import json
import argparse
import base64
from random import randint
from random import choice
from random import sample
from datetime import date
from datetime import datetime
from time import mktime

def usage():
    print 'dbFill.py -u <baseurl> -p <port> -n <numInputs>'

def getUsers(conn):
    # Retrieve the list of users
    conn.request("GET","""/api/users?filter={"_id":1}""")
    response = conn.getresponse()
    data = response.read()
    d = json.loads(data)

    # Array of user IDs
    users = [str(d['data'][x]['_id']) for x in xrange(len(d['data']))]

    return users

def main(argv):
    Seller_Product_Dic =  {}
    SoldTo_Product_Dic =  {}
    Watching_Product_Dic =  {}
    

    parser = argparse.ArgumentParser(description="fill the remote database with the specified number of users and products")
    parser.add_argument('-u', '--url', action='store', dest='url', help='the ip address of the server', default='localhost')
    parser.add_argument('-p', '--port', action='store', dest='port', help='the port on the server', default='3000')
    parser.add_argument('-n', '--inputs', action='store', dest='inputs', help='specify the number of users to fill the database with', type=int, default=20)

    args = parser.parse_args()


    # Server Base URL and port
    baseurl = args.url
    port = args.port

    # Number of POSTs that will be made to the server
    inputCount = args.inputs


    # Server to connect to (1: url, 2: port number)
    conn = httplib.HTTPConnection(baseurl, port)

    # HTTP Headers
    headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}

    # Loop 'userCount' number of times
    for i in xrange(inputCount):

        params = urllib.urlencode({ 'words': 'Years after our planes stopped marking white xs',
                                'color' : 'Black',
                                'weight' : 'normal'})
        
        # POST the user
        conn.request("POST", "/words", params, headers)
        response = conn.getresponse()
        data = response.read()
       #print data
        #d = json.loads(data)



  
    # Exit gracefully
    conn.close()
    # print Seller_Product_Dic

if __name__ == "__main__":
     main(sys.argv[1:])