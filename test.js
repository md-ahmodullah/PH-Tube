const toStringDateTime = (time) => {
    const hours = parseInt(time / 3600);
    let remainingSec = time % 3600;
    const minutes = parseInt(remainingSec / 60);
    remainingSec = remainingSec % 60
    console.log(`${hours} hours ${minutes} minutes ${remainingSec} seconds ago`);
}
toStringDateTime(15950)