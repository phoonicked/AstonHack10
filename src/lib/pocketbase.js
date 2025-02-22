import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
export default pb;

async function fetchClothing(collectionName) {
    return await pb.collection(collectionName).getFullList({
        sort: 'name',
    });
}

async function addClothingItem(collectionName, itemData) {
    try {
        const record = await pb.collection(collectionName).create(itemData);
        console.log('Item added:', record);
    } catch (error) {
        console.error('Error adding item:', error);
    }
}


async function addClothingWithImage(collectionName, itemData, fileInput) {
    const formData = new FormData();
    formData.append('name', itemData.name);
    formData.append('description', itemData.description);
    formData.append('colour', itemData.colour);
    formData.append('image', fileInput.files[0]);

    try {
        const record = await pb.collection(collectionName).create(formData);
        console.log('Item added with image:', record);
    } catch (error) {
        console.error('Error adding item with image:', error);
    }
}


async function updateClothingItem(collectionName, itemId, updatedData) {
    try {
        const record = await pb.collection(collectionName).update(itemId, updatedData);
        console.log('Item updated:', record);
    } catch (error) {
        console.error('Error updating item:', error);
    }
}

async function deleteClothingItem(collectionName, itemId) {
    try {
        await pb.collection(collectionName).delete(itemId);
        console.log('Item deleted');
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

const shirts = await fetchClothing('shirts');
const pants = await fetchClothing('pants');
const jackets = await fetchClothing('jackets');
const polos = await fetchClothing('polos');
const hoodies = await fetchClothing('hoodies');
const dresses = await fetchClothing('dresses');

console.log(shirts);
console.log(pants);
console.log(jackets);
console.log(polos);
console.log(hoodies);
console.log(dresses);
