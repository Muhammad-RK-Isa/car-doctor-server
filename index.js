import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from "mongodb";
import { ObjectId } from "mongodb";

const app = express();
const port = process.env.PORT || 5000;
dotenv.config();
app.use( express.json() );
app.use( cors() );

const uri = `mongodb+srv://${ process.env.MDB_USER }:${ process.env.MDB_PASSWORD }@cluster0.9wh3o6k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient( uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
} );

const run = async () => {
    try {
        await client.connect();
        await client.db( 'admin' ).command( { ping: 1 } );
        console.log( "Pinged your deployment. You successfully connected to MongoDB!" );

        const serviceCollection = client.db( 'cardoctor' ).collection( 'services' );
        const orderCollection = client.db( 'cardoctor' ).collection( 'orders' );

        app.get( '/services', async ( req, res ) => {
            const cursor = serviceCollection.find();
            const services = await cursor.toArray();
            res.send( services );
        } );

        app.get( '/service/:_id', async ( req, res ) => {
            const { _id } = req.params;
            const service = await serviceCollection.findOne( { _id: new ObjectId( _id ) } );
            res.send( service );
        } );

        app.post( '/orders', async ( req, res ) => {
            const order = req.body;
            const result = await orderCollection.insertOne( order );
            res.send( result );
        } );
    }
    finally {
        // await client.close();
        // console.log( "Connection closed!" );
    };
};
run().catch( console.dir );

app.get( '/', ( req, res ) => {
    res.send( 'Hello from Car Doctor!' );
} );


app.listen( port, '192.168.0.179', () => {
    console.log( `Car Doctor Server is running on port ${ port }` );
} );
