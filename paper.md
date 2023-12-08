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
Brain extraction and segmentation are the first step for most neuroimaging analyses. Automatic methods work well in adult human brains, but produce unreliable results in non-human data, due to muscle tissue, skull, and luminosity gradients. Thresholdmann (https://neuroanatomy.github.io/thresholdmann) is an open source Web tool for the interactive application of space-varying thresholds to Nifti volumes. No download or installation are required and all processing is done on the user’s computer. Nifti volumes are dragged onto the Web app and become available for visual exploration in a stereotaxic viewer. A space-varying threshold is then created by setting control points, each with their own local threshold. The viewer is initialised with one control point at the centre of the volume, and a local threshold. The addition of further control points produces a space-varying threshold obtained through interpolation. Each point can be repositioned, removed, and each local threshold can be adjusted in real time using sliders. The threshold direction can be switched to allow segmentation of the structure of interest in different imaging modalities, including T1 and T2 weighted contrasts, and the size of the applied threshold can be adjusted based on image quality. The opacity of the mask and the brightness and contrast of the MRI data can be modified via sliders for optimal visibility. A 3D model of the thresholded mask can be computed on the fly to inspect the result in an interactive 3D render. Finally, the thresholded mask, the space varying threshold and the list of control points can be saved for later use in scripted workflows, able to reproduce the thresholded volume from the original data.

# Statement of need 
Brain extraction and segmentation are required for any downstream analysis of neuroimaging data. Obtaining appropriate masks can be particularly difficult in non-human brain imaging, as standard automatic tools struggle with the surrounding muscle tissue, skull, and strong luminosity gradients. A simple interactive threshold is intuitive and fast to apply, and can often provide a rather good initial guess. However, because of luminosity gradients, the threshold that works for one brain region is likely to fail in another.  

Thresholdmann complements the variety of existing brain segmentation tools, providing an easy interface to manually control the segmentation on a local scale across different brain imaging modalities and image contrast gradients. The masks produced by Thresholdmann can serve as a starting point for more detailed manual editing using tools such as BrainBox (https://brainbox.pasteur.fr) [@BrainBox] or ITK-SNAP (http://itksnap.org) [@itkSNAP]. This interactive approach is especially valuable for non-human brain imaging data, where automatic approaches often require extensive manual adjustment anyway [@PrimeDE; @PrimeRE; @PrimeDE2]. We have used Thresholdmann successfully to create initial brain masks for a variety of vertebrate brains – including many non-human primate datasets [@34primates; @cerebella] – as well as developmental data.

# Methods
The spatially-varying threshold is computed from a number of control points. Each control point has a position $`x_i`$ and a threshold value $`v_i`$. At each point $`x`$ of the volume, the local threshold is computed as a weighted function of the control points. The weight associated to the i-th control point at position $`x`$ is given by:  
$$w_i \left( x \right) = \dfrac1 {\left( x-x_i \right)^2+\epsilon} ,$$  
where $`\epsilon`$ is a small number used to prevent a division by 0 at the exact position of control points. The value of the threshold at position $`x`$ is the obtained as:  
$$v \left( x \right) = \dfrac{ \sum\limits_i^n v_i w_i \left( x \right)} {W \left( x \right)} ,$$  
where $`W(x)`$ is the sum of all weights, given by:  
$$W \left( x \right) = \sum_i^n w_i \left( x \right) .$$  

Additionally, we add a “background” threshold value which makes the action of the control points localised. The background value is independent of the distance and is given a small constant weight. In that manner, positions far from all control points get the background threshold value.  

Thresholdmann was coded in JavaScript and runs as a GitHub Web page. Code style was verified using ESLint (https://eslint.org). Unit tests and end-to-end tests were implemented using Mocha (https://mochajs.org) and Puppeteer (https://pptr.dev). Modifications in the code are continuously tested using CircleCI (https://circleci.com).

# Figures
![Thresholdmann interface and 3D viewer. The <b>left panel</b> allows to select different control point actions, set the thresholding direction, switch between the threshold mask or value view, open the 3D viewer, load or save the work, change the opacity of the mask, the brightness and contrast of the MRI, and information about the imaging data. The <b>central panel</b> is a stereotaxic viewer which allows you to move through the slices using the slider at the bottom, to switch between the 3 stereotaxic planes, and to interactively set, move or remove control points. You can view the threshold mask, or the corresponding threshold value space. The <b>right panel</b> shows for each control point the stereotaxic coordinates, an adjustment slider to change the local threshold, and the threshold value. The selected control point is highlighted in the panel and the viewer jumps to the corresponding slice. The <b>interactive 3D viewer</b> opens in a separate browser window. The figure shows the sloth bear from the Brain Catalogue [@BrainCatalogue].\label{fig:thresholdmann1}](https://raw.githubusercontent.com/neuroanatomy/thresholdmann/master/img/thresholdmann_fig1.png)

![Thresholdmann interface and workflow. Control points (blue dots) are added by clicking at the desired position in the viewer. This adds a slider to the right, which can be used to locally adapt the threshold. The figure describes the progressive addition of control points to create a mask of the brain for a  macaque from Prime-DE site "amu" [@Brochier_etal2019; @PrimeDE].\label{fig:thresholdmann2}](https://raw.githubusercontent.com/neuroanatomy/thresholdmann/master/img/thresholdmann_fig2.png)

![Thresholdmann viewer. Threshold mask and corresponding threshold value. These volumes are updated in real time and can both be inspected interactively. The set of control points and the mask can be downloaded.\label{fig:thresholdmann3}](https://raw.githubusercontent.com/neuroanatomy/thresholdmann/master/img/thresholdmann_fig3.png

![Thresholdmann result. We downloaded the mask presented above based on the shown set of eight control points. The brain region was sufficiently disjoint from the rest of the head so that a mathematical morphology closing was enough to completely separate it. The figure shows stereotaxic planes and a surface reconstruction of the mask.\label{fig:thresholdmann4}](https://raw.githubusercontent.com/neuroanatomy/thresholdmann/master/img/thresholdmann_fig4.png)

# Acknowledgements
We thank Demian Wassermann for discussions about radial basis functions that inspired the first version of our tool.

# References
