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
    affiliation: "1, 2"
  - name: Roberto Toro  
    orcid: 0000-0002-6671-858X  
    affiliation: "1, 3"  
affiliations:
 - name: Center for Research and Interdisciplinarity, University of Paris  
   index: 1
 - name: Max Planck Institute for Human Cognitive and Brain Sciences  
   index: 2
 - name: Institut Pasteur  
   index: 3
date: 12 September 2020  
bibliography: paper.bib  

---

# Summary
Thresholdmann (https://neuroanatomy.github.io/thresholdmann) is an open source Web tool for the interactive application of space-varying thresholds to nifti volumes No download or installation are required and all processing is done in the user’s computer. Nifti volumes are dragged onto the Web app and become available for visual exploration in a stereotaxic viewer. A space-varying threshold is then created by setting control points, each with their own local threshold. The viewer is initialised with one control point at the center of the volume. The addition of further control points produces a space-varying threshold obtained through radial basis function interpolation. Each local threshold can be adjusted in real time using sliders. Finally, the thresholded mask, the space varying threshold and the list of control points can be saved for later use in scripted workflows.

# Statement of need 
Brain extraction and segmentation are required for any downstream analysis of neuroimaging data. Obtaining appropriate masks can be particularly difficult in non-human brain imaging, as standard automatic tools struggle with the surrounding muscle tissue, skull, and strong luminosity gradients. A simple interactive threshold is intuitive and fast to apply, and can often provide a rather good initial guess. However, because of luminosity gradients, the threshold that works for one brain region is likely to fail in another.  

Thresholdmann complements the variety of existing brain segmentation tools, providing an easy interface to manually control the segmentation on a local scale. The masks produced by Thresholdmann can serve as a starting point for more detailed manual editing using tools such as BrainBox (https://brainbox.pasteur.fr) [@BrainBox] or ITK-SNAP (http://itksnap.org) [@itkSNAP]. This interactive approach is especially valuable for non-human brain imaging data, where automatic approaches often require extensive manual adjustment anyway. We have used Thresholdmann successfully to create initial brain masks for a variety of vertebrate brains – including many non-human primate datasets [@34primates] – as well as developmental data.

# Methods

# Figures

# Acknowledgements

# References
