import { Client, Databases, ID, Query, Storage } from 'appwrite';
import conf from '../conf/conf.js';

export default class Services {
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client.
                    setEndpoint(conf.appwriteURL).
                    setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId, 
            conf.appwriteCollectionId, 
        slug, 
        {
            title, 
            content, 
            featuredImage, 
            status,
            userId,
        } 
)
        } catch (error) {
            console.log("Appwrite Service :: createPost :: error", error)
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId, 
                conf.appwriteCollectionId, 
                slug, 
                {
                    title, 
                    content, 
                    featuredImage, 
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite Service :: updatePost :: error", error)
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )

            return true
        } catch (error) {
            console.log("Appwrite Service :: deletePost :: error", error)
            return false
        }
    }

    async getPost(slug){
        console.log('Fetching post from database:', conf.appwriteDatabaseId, 'collection:', conf.appwriteCollectionId)
        try {
            return await this.databases.getDocument(

                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite Service :: getPost :: error", error)
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId, 
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log("Appwrite Service :: getPosts :: error", error)
            return false;
        }
    }

    //File Upload Services

    async uploadFile(file){
        console.log("File to be uploaded:", file)
        try {
            
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite Service :: uploadFile :: error", error)
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite Service :: deleteFile :: error", error)
            return false;
        }
    }

    getFilePreview(fileId){
        console.log("Getting file preview for fileId:", fileId);
        return this.bucket.getFilePreview(
            conf.appwriteBucketId, 
            fileId
        )
    }
}