---
title: 'Thresholdmann: A Web tool for interactively creating adaptive thresholds to segment MRI data.'  
tags:
  - Neuroscience
  - Neuroanatomy
  - Neuroimaging
  - Nifti
  - JavaScript
  - Web tool  
authors:
  - name: Katja Heuer   
    orcid: 0000-0002-7237-0196  
    affiliation: "1"
  - name: Nicolas Traut   
    orcid: 0000-0003-3277-6316  
    affiliation: "1"
  - name: Roberto Toro  
    orcid: 0000-0002-6671-858X  
    affiliation: "1"  
affiliations:
 - name: Institut Pasteur, Université Paris Cité, Unité de Neuroanatomie Appliquée et Théorique, F-75015 Paris, France  
   index: 1
date: 20 November 2023  
bibliography: paper.bib  

---

# Summary
Thresholdmann (https://neuroanatomy.github.io/thresholdmann) is an open source Web tool for the interactive application of space-varying thresholds to nifti volumes. No download or installation are required and all processing is done in the user’s computer. Nifti volumes are dragged onto the Web app and become available for visual exploration in a stereotaxic viewer. A space-varying threshold is then created by setting control points, each with their own local threshold. The viewer is initialised with one control point at the center of the volume. The addition of further control points produces a space-varying threshold obtained through radial basis function interpolation. Each local threshold can be adjusted in real time using sliders. Finally, the thresholded mask, the space varying threshold and the list of control points can be saved for later use in scripted workflows.

# Statement of need 
Brain extraction and segmentation are required for any downstream analysis of neuroimaging data. Obtaining appropriate masks can be particularly difficult in non-human brain imaging, as standard automatic tools struggle with the surrounding muscle tissue, skull, and strong luminosity gradients. A simple interactive threshold is intuitive and fast to apply, and can often provide a rather good initial guess. However, because of luminosity gradients, the threshold that works for one brain region is likely to fail in another.  

Thresholdmann complements the variety of existing brain segmentation tools, providing an easy interface to manually control the segmentation on a local scale. The masks produced by Thresholdmann can serve as a starting point for more detailed manual editing using tools such as BrainBox (https://brainbox.pasteur.fr) [@BrainBox] or ITK-SNAP (http://itksnap.org) [@itkSNAP]. This interactive approach is especially valuable for non-human brain imaging data, where automatic approaches often require extensive manual adjustment anyway. We have used Thresholdmann successfully to create initial brain masks for a variety of vertebrate brains – including many non-human primate datasets [@34primates; @cerebella] – as well as developmental data.

# Methods
Thresholdmann was coded in JavaScript and runs as a GitHub Web page. Code style was verified using eslint (https://eslint.org). Unit tests and end-to-end tests were implemented using mocha.js (https://mochajs.org) and puppeteer (https://pptr.dev). Modifications in the code are continuously tested using CircleCI (https://circleci.com).

# Figures
![Figure 1. Thresholdmann interface and workflow. Control points (blue dots) are added by clicking at the desired position in the viewer. This adds a slider to the right, which can be used to locally adapt the threshold. The figure describes the progressive addition of control points to create a mask of the brain for a  macaque from Prime-DE site "amu" [@Brochier_etal2019; @PrimeDE].\label{fig:thresholdmann1}](https://raw.githubusercontent.com/neuroanatomy/thresholdmann/master/img/thresholdmann_fig1.png)

![Figure 2. Thresholdmann viewer. Threshold mask and corresponding threshold value. These volumes are updated in real time and can both be inspected interactively. The set of control points and the mask can be downloaded.\label{fig:thresholdmann2}](https://raw.githubusercontent.com/neuroanatomy/thresholdmann/master/img/thresholdmann_fig2.png)

![Figure 3. Thresholdmann result. We downloaded the mask presented above based on the shown set of eight control points. The brain region was sufficiently disjoint from the rest of the head so that a mathematical morphology closing was enough to completely separate it. The figure shows stereotaxic planes and a surface reconstruction of the mask.\label{fig:thresholdmann3}](https://raw.githubusercontent.com/neuroanatomy/thresholdmann/master/img/thresholdmann_fig3.png)

# Acknowledgements
We thank Demian Wassermann for discussions about radial basis functions.

# References
