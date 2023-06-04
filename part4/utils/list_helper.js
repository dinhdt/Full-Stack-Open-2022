const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, item) => item.likes + sum, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((maxObj, item) => {
        if (item) {
            if(maxObj && item.likes < maxObj.likes) {
                return maxObj
            }
            else {
                return { title : item.title, author : item.author, likes : item.likes }
            }
        }
        return maxObj
    }, {})
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}