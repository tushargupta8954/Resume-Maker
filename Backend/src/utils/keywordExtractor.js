import natural from 'natural';

const { TfIdf } = natural;

export const extractKeywords = (text, maxKeywords = 20) => {
  const tfidf = new TfIdf();
  tfidf.addDocument(text);

  const keywords = [];
  tfidf.listTerms(0).forEach((item) => {
    if (item.term.length > 3 && keywords.length < maxKeywords) {
      keywords.push(item.term);
    }
  });

  return keywords;
};

export const compareKeywords = (resumeText, jobDescription) => {
  const resumeKeywords = extractKeywords(resumeText, 50);
  const jobKeywords = extractKeywords(jobDescription, 50);

  const matched = resumeKeywords.filter((keyword) =>
    jobKeywords.includes(keyword)
  );

  const missing = jobKeywords.filter(
    (keyword) => !resumeKeywords.includes(keyword)
  );

  return {
    matched,
    missing: missing.slice(0, 15),
    matchRate: (matched.length / jobKeywords.length) * 100,
  };
};