const Resume = require('../models/resume.model');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const asyncHandler = require('../../utils/asyncHandler');
const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * A mock function to simulate calling the OpenAI API.
 * In a real application, you would replace this with an actual API call to OpenAI.
 * @param {string} prompt - The prompt to send to the AI.
 * @returns {Promise<string>} A promise that resolves to the AI-generated text.
 */

const generateProfessionalSummary = asyncHandler(async (req, res) => {
    try {
        const { userInput } = req.body;
        if (!userInput) {
            return res.status(400).json({ message: 'User input is required.' });
        }
        const prompt = `Create a concise 2-3 sentence professional summary for the following resume data:\n${JSON.stringify(userInput)}\nTone: professional, active verbs, max 50 words.`;
        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 120,
        });

        res.status(200).json({ completion: completion.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate professional summary.', error: error.message });
    }
});

const createResume = asyncHandler(async (req, res) => {
    try {
        const resume = new Resume({ ...req.body, user: req.user._id });
        await resume.save();
        res.status(201).json(resume);
    } catch (error) {
        res.status(400).json({ message: 'Error creating resume', error: error.message });
    }
});

const updateResume = asyncHandler(async (req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json(resume);
    } catch (error) {
        res.status(400).json({ message: 'Error updating resume', error: error.message });
    }
});

const generatePdf = asyncHandler(async (req, res) => {
    try {
        const { resumeId, template } = req.body;
        const resume = await Resume.findById(resumeId).populate('user');

        if (!resume) {
            return res.status(404).send('Resume not found');
        }

        const templatePath = path.join(__dirname, `../templates/${template}.html`);
        console.log('Template Path:', templatePath);
        if (!fs.existsSync(templatePath)) {
            return res.status(400).send('Template not found');
        }

        let html = fs.readFileSync(templatePath, 'utf-8');

        // Simple templating (replace placeholders)
        html = html.replace(/{{name}}/g, resume.user?.name || resume.title || '');
        html = html.replace(/{{email}}/g, resume.user?.email || '');
        html = html.replace(/{{title}}/g, resume.title || '');
        html = html.replace(/{{professionalSummary}}/g, resume.professionalSummary || '');

        const skillsHtml = resume.skills.map(skill => `<li>${skill}</li>`).join('');
        html = html.replace('{{skills}}', skillsHtml);

        const workExperienceHtml = resume.workExperience.map(job => `
            <div class="job">
                <h3 class="job-title">${job.jobTitle || ''}</h3>
                <p class="company">${job.company || ''}</p>
                <p class="date">${job.startDate || ''} - ${job.endDate || 'Present'}</p>
                <p class="description">${job.description || ''}</p>
            </div>
        `).join('');
        html = html.replace('{{workExperience}}', workExperienceHtml);

        const educationHtml = resume.education.map(edu => `
            <div class="edu-item">
                <h3 class="degree">${edu.degree || ''}</h3>
                <p class="institution">${edu.institution || ''} - ${edu.fieldOfStudy || ''}</p>
                <p class="date">${edu.startDate || ''} - ${edu.endDate || 'Present'}</p>
            </div>
        `).join('');
        html = html.replace('{{education}}', educationHtml);

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${resume.title.replace(/\s/g, '_') || 'resume'}.pdf`);
        res.send(pdf);
    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).send('Error generating PDF');
    }
})

const getResumes = asyncHandler(async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch resumes.', error: error.message });
    }
});

module.exports = {
    generateProfessionalSummary,
    createResume,
    updateResume,
    generatePdf,
    getResumes,
};
