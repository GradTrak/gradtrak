#!/bin/bash

help () {
    echo "syncMongo - Synchronize GradTrak MongoDB databases"
    echo
    usage
    echo
    echo "Options:"
    echo "  -s Source URI, starting with mongodb:// or mongodb+srv://"
    echo "  -f Source database name"
    echo "  -d Destination URI, starting with mongodb:// or mongdb+srv://"
    echo "  -t Destination database name"
    echo "  -h Print help"
    echo
    echo "Specifying -s 'local' or -d 'local' will set the appropriate URI to
mongodb://localhost:27017/gradtrak and the DB name to gradtrak, the default
local installation used by the GradTrak server."
    echo
    echo "Examples:"
    echo "  $ $0 -s 'mongodb+srv://example.com/db' -f db -d 'mongodb://foo.com/bar' -t bar"
    echo "  $ $0 -s 'mongodb+srv://example.com/db' -f db -t 'local'"
    echo "  $ $0 -s 'local' -d 'mongodb+srv://example.com/db' -t db"
}

usage () {
    echo "usage: $0 -s src_uri -f src_db -d dst_uri -t dst_db"
    echo "usage: $0 -s 'local' -d dst_uri -t dst_db"
    echo "usage: $0 -s src_uri -f src_db -d 'local'"
    echo "usage: $0 -h"
}

while getopts "hs:d:f:t:" flag; do
    case "${flag}" in
        h)
            help
            exit 1
            ;;
        s)
            if [ "${OPTARG}" = 'local' ]; then
                SRC="mongodb://localhost:27017/gradtrak"
                SRC_DB="gradtrak"
            else
                SRC="${OPTARG}"
            fi
            ;;
        d)
            if [ "${OPTARG}" = 'local' ]; then
                DST="mongodb://localhost:27017/gradtrak"
                DST_DB="gradtrak"
            else
                DST="${OPTARG}"
            fi
            ;;
        f)
            SRC_DB="${OPTARG}"
            ;;
        t)
            DST_DB="${OPTARG}"
            ;;
    esac
done

if [ -z "${SRC}" ] || [ -z "${DST}" ] || [ -z "{$SRC_DB}" ] || [ -z "${DST_DB}" ]; then
    usage
    exit 1
fi

mongodump --archive "${SRC}" | mongorestore --archive --nsFrom="${SRC_DB}.*" --nsTo="${DST_DB}.*" --drop "${DST}"
