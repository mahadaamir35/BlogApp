const mongoose = require('mongoose')
const Blog = require('./models/blog')

mongoose.connect('mongodb://127.0.0.1:27017/blogApp')
.then(() => {
    console.log('db connected');
})


const seedDb = async function () {
    const blog1 = new Blog({
        title: 'Four fun things', 
        text: 'In Dream Scenario, a dark comedy from A24, Nick Cage plays a humble college professor who starts popping up in strangers dreams. Looks fun, will you see it?',
        author: '65507bb97583a7c7a4634f15',
        isDisabled: false
    })
    const blog2 = new Blog({
        title: 'Would you sing karaoke at your wedding', 
        text: 'A few years ago, I once went to a wedding where...   ...guests sang karaoke at the reception. One of the groomsmen, Michael, who until then had been pretty quiet and reserved, brought down the house singing Frank Sinatras My Way. (Everyone was then like, wait, is Michael super hot?)',
        author: '65507bb97583a7c7a4634f15',
        isDisabled: false
    })
    const blog3 = new Blog({
        title: 'How do you parent a tween?', 
        text: 'There are suddenly parenting books all over our apartment, splayed on the floor beside my bed, stacked on the sofa, tucked next to the toilet, dog-eared and underlined. I send photos of paragraphs to my husband with texts like, “We need to start doing this!” or in all-caps, screaming, “READ THIS NOW!!!!” I want every piece of advice. I want to inject the books into my veins.',
        author: '65507bb97583a7c7a4634f15', 
        isDisabled: false
    })
    const blog4 = new Blog({
        title: 'The #1 thing to do when you get a job offer', 
        text: '“Long story short — people often leave money on the table,” Jeremy told me. “In a recent Pew Research Center study, 66% of people who asked for more money got some or all of what they asked for. There are few moments in life where a short conversation could yield so much.” Plus, think about how much a salary increase can add up over the years. “The power of compound interest, baby!” he says.',
        author: '65507bb97583a7c7a4634f15',
        isDisabled: false
    })
    const blog5 = new Blog({
        title: 'What are your low-stakes burns?', 
        text: 'When we were growing up, my siblings and I would complain to our mom about various annoying people at school or work or ballet practice. Her reply? “They can take a flying leap!” And her backup? “Tell him to go jump in a lake.”',
        author: '65507bb97583a7c7a4634f15',
        isDisabled: false
    })
    await blog1.save()
    await blog2.save()
    await blog3.save()
    await blog4.save()
    await blog5.save()
}

seedDb()