const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

router.get('/', async(req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async(req, res) => {
    try {
        const { title, description, goal, deadline } = req.body;

        const newCampaign = new Campaign({
            title,
            description,
            goal,
            deadline
        });

        const campaign = await newCampaign.save();
        res.json(campaign);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/:id/donate', async(req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ msg: 'Campaign not found' });
        }

        const { name, amount, message } = req.body;

        campaign.donations.push({
            name: name || 'Anonymous',
            amount,
            message
        });

        campaign.raised += amount;

        await campaign.save();
        res.json(campaign);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async(req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ msg: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Campaign not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;