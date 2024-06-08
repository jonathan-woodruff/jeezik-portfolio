const a = /yo/;
const myArr = a.exec('hi yo mama');
if (myArr !== null) {
    console.log('hi');
} else {
    console.log('hey');
}
